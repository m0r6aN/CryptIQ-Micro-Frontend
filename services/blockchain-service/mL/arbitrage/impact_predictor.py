# File: services/trading-service/ml/arbitrage/impact_predictor.py

import numpy as np
import torch
import torch.nn as nn
from typing import Dict, List, Optional
from dataclasses import dataclass
import pandas as pd
from sklearn.preprocessing import StandardScaler
from scipy.stats import norm

@dataclass
class ImpactPrediction:
    total_impact: float
    pool_impacts: Dict[str, float]
    expected_profit: float
    uncertainty: float
    risk_contribution: float
    reversal_time: float

class MarketImpactPredictor:
    def __init__(self):
        # Load pre-trained models
        self.impact_model = self._load_impact_model()
        self.reversal_model = self._load_reversal_model()
        self.uncertainty_model = self._load_uncertainty_model()
        
        # Initialize scalers
        self.feature_scaler = StandardScaler()
        self.load_scalers('models/scalers.pkl')
        
        # Historical impact tracker
        self.impact_history = defaultdict(lambda: deque(maxlen=1000))
        
        # Pool-specific parameters
        self.pool_params = defaultdict(lambda: {
            'alpha': 0.5,  # Decay factor
            'beta': 1.5,   # Elasticity
            'gamma': 0.1   # Cross-impact factor
        })

    async def predict_impact(
        self,
        path: List[Dict],
        pools: List[Dict],
        gas_price: int
    ) -> ImpactPrediction:
        """Predict market impact of arbitrage execution"""
        
        # Get current market state features
        features = self._extract_features(path, pools, gas_price)
        scaled_features = self.feature_scaler.transform(features)
        
        # Predict base impact
        with torch.no_grad():
            impact_pred = self.impact_model(
                torch.FloatTensor(scaled_features)
            )
            base_impact = float(impact_pred[0])

        # Calculate pool-specific impacts
        pool_impacts = {}
        total_impact = 0
        
        for i, step in enumerate(path):
            pool = pools[i]
            params = self.pool_params[pool['address']]
            
            # Calculate primary impact
            primary_impact = self._calculate_primary_impact(
                amount=step['amount'],
                pool=pool,
                params=params
            )
            
            # Calculate cross-pool impact
            cross_impact = self._calculate_cross_impact(
                step=step,
                pools=pools,
                params=params
            )
            
            # Combine impacts
            pool_impact = primary_impact + cross_impact
            pool_impacts[pool['address']] = pool_impact
            total_impact += pool_impact

        # Predict uncertainty
        uncertainty = self._predict_uncertainty(
            base_impact=base_impact,
            pool_impacts=pool_impacts,
            features=scaled_features
        )

        # Predict price reversal time
        reversal_time = self._predict_reversal_time(
            impact=total_impact,
            path=path,
            pools=pools
        )

        # Calculate risk contribution
        risk_score = self._calculate_risk_score(
            total_impact=total_impact,
            uncertainty=uncertainty,
            reversal_time=reversal_time
        )

        # Calculate expected profit after impact
        expected_profit = self._calculate_expected_profit(
            path=path,
            total_impact=total_impact,
            uncertainty=uncertainty
        )

        return ImpactPrediction(
            total_impact=total_impact,
            pool_impacts=pool_impacts,
            expected_profit=expected_profit,
            uncertainty=uncertainty,
            risk_contribution=risk_score,
            reversal_time=reversal_time
        )

    def _calculate_primary_impact(
        self,
        amount: float,
        pool: Dict,
        params: Dict
    ) -> float:
        """Calculate primary market impact on a single pool"""
        # Use square root model with decay
        pool_depth = pool['reserve0'] * pool['reserve1']
        normalized_amount = amount / np.sqrt(pool_depth)
        
        # Apply power law with elasticity beta
        base_impact = params['alpha'] * (normalized_amount ** params['beta'])
        
        # Apply exponential decay based on pool depth
        decay = np.exp(-params['alpha'] * pool_depth)
        
        return base_impact * (1 - decay)

    def _calculate_cross_impact(
        self,
        step: Dict,
        pools: List[Dict],
        params: Dict
    ) -> float:
        """Calculate cross-pool impact"""
        cross_impact = 0
        token_in, token_out = step['token_in'], step['token_out']
        
        for pool in pools:
            if pool['token0'] in [token_in, token_out] or \
               pool['token1'] in [token_in, token_out]:
                # Calculate correlation-weighted impact
                correlation = self._get_pool_correlation(
                    pool1=step['pool'],
                    pool2=pool['address']
                )
                
                normalized_depth = pool['reserve0'] * pool['reserve1']
                cross_effect = params['gamma'] * correlation * \
                    np.exp(-normalized_depth)
                
                cross_impact += cross_effect

        return cross_impact

    def _predict_uncertainty(
        self,
        base_impact: float,
        pool_impacts: Dict[str, float],
        features: np.ndarray
    ) -> float:
        """Predict uncertainty in impact estimation"""
        with torch.no_grad():
            uncertainty_pred = self.uncertainty_model(
                torch.FloatTensor([
                    base_impact,
                    *pool_impacts.values(),
                    *features.flatten()
                ])
            )
        
        # Scale uncertainty based on historical accuracy
        historical_error = self._get_historical_error()
        return float(uncertainty_pred[0]) * historical_error

    def _predict_reversal_time(
        self,
        impact: float,
        path: List[Dict],
        pools: List[Dict]
    ) -> float:
        """Predict time for price impact to reverse"""
        features = np.array([
            impact,
            len(path),
            sum(p['volume_24h'] for p in pools),
            max(p['reserve0'] * p['reserve1'] for p in pools)
        ])
        
        with torch.no_grad():
            reversal_pred = self.reversal_model(
                torch.FloatTensor(features)
            )
        
        return float(reversal_pred[0])

    def _calculate_risk_score(
        self,
        total_impact: float,
        uncertainty: float,
        reversal_time: float
    ) -> float:
        """Calculate risk score based on impact characteristics"""
        # Higher impact, uncertainty, and reversal time increase risk
        impact_risk = norm.cdf(total_impact, loc=0.02, scale=0.01)
        uncertainty_risk = norm.cdf(uncertainty, loc=0.5, scale=0.2)
        time_risk = 1 - np.exp(-reversal_time / 60)  # Normalize to minutes
        
        # Combine risks using weighted average
        weights = [0.4, 0.4, 0.2]
        return np.average(
            [impact_risk, uncertainty_risk, time_risk],
            weights=weights
        )

    def _calculate_expected_profit(
        self,
        path: List[Dict],
        total_impact: float,
        uncertainty: float
    ) -> float:
        """Calculate expected profit after impact"""
        # Get raw arbitrage profit
        raw_profit = path[-1]['amount_out'] - path[0]['amount_in']
        
        # Adjust for impact and uncertainty
        impact_adjusted = raw_profit * (1 - total_impact)
        
        # Use uncertainty for confidence interval
        confidence = 0.95  # 95% confidence
        z_score = norm.ppf(confidence)
        
        lower_bound = impact_adjusted - z_score * uncertainty * raw_profit
        
        return max(0, lower_bound)  # Can't have negative expected profit

    def update_from_execution(
        self,
        prediction: ImpactPrediction,
        actual_impact: float,
        execution_time: float
    ):
        """Update models based on actual execution results"""
        # Calculate prediction error
        impact_error = abs(actual_impact - prediction.total_impact)
        
        # Update historical error tracking
        self.impact_history['errors'].append(impact_error)
        
        # Update pool parameters if error is large
        if impact_error > 0.01:  # 1% threshold
            self._update_pool_params(prediction, actual_impact)
        
        # Periodically retrain models if enough new data
        if len(self.impact_history['errors']) >= 100:
            self._retrain_models()

    def _update_pool_params(
        self,
        prediction: ImpactPrediction,
        actual_impact: float
    ):
        """Update pool-specific impact parameters"""
        learning_rate = 0.01
        
        for pool_id, predicted_impact in prediction.pool_impacts.items():
            params = self.pool_params[pool_id]
            
            # Update alpha (decay factor)
            if actual_impact > predicted_impact:
                params['alpha'] *= (1 + learning_rate)
            else:
                params['alpha'] *= (1 - learning_rate)
            
            # Update beta (elasticity)
            volume_ratio = self.impact_history['volumes'].get(pool_id, 1.0)
            params['beta'] = max(1.0, params['beta'] * volume_ratio)
            
            # Update gamma (cross-impact)
            if len(prediction.pool_impacts) > 1:
                cross_ratio = actual_impact / predicted_impact
                params['gamma'] *= cross_ratio

            self.pool_params[pool_id] = params

    def _get_pool_correlation(self, pool1: str, pool2: str) -> float:
        """Get historical price correlation between pools"""
        # Use cached correlations or calculate if needed
        key = tuple(sorted([pool1, pool2]))
        if key not in self.correlation_cache:
            correlation = self._calculate_pool_correlation(pool1, pool2)
            self.correlation_cache[key] = correlation
        return self.correlation_cache[key]

    @torch.no_grad()
    def _retrain_models(self):
        """Periodically retrain models on new data"""
        if len(self.impact_history['errors']) < 1000:
            return
            
        # Prepare training data
        X_train, y_train = self._prepare_training_data()
        
        # Update primary impact model
        self.impact_model.train()
        optimizer = torch.optim.Adam(self.impact_model.parameters())
        
        for _ in range(100):  # 100 epochs
            optimizer.zero_grad()
            pred = self.impact_model(X_train)
            loss = nn.MSELoss()(pred, y_train)
            loss.backward()
            optimizer.step()
            
        self.impact_model.eval()
        
        # Clear history after training
        self.impact_history.clear()
