import numpy as np
import pandas as pd
from typing import List, Dict, Optional
from dataclasses import dataclass
import torch
import torch.nn as nn
from scipy.optimize import minimize
from collections import defaultdict

@dataclass
class ArbitrageOpportunity:
    path: List[Dict]
    expected_profit: float
    confidence: float
    required_amount: float
    risk_score: float
    execution_time_ms: float
    pool_impacts: Dict[str, float]

class DeepArbitrageDetector(nn.Module):
    def __init__(self, num_tokens: int, hidden_size: int = 128):
        super().__init__()
        self.price_encoder = nn.Sequential(
            nn.Linear(num_tokens * num_tokens, hidden_size),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(hidden_size, hidden_size // 2)
        )
        
        self.liquidity_encoder = nn.Sequential(
            nn.Linear(num_tokens * num_tokens, hidden_size),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(hidden_size, hidden_size // 2)
        )
        
        self.opportunity_decoder = nn.Sequential(
            nn.Linear(hidden_size, hidden_size),
            nn.ReLU(),
            nn.Linear(hidden_size, 3)  # [profit_potential, confidence, risk]
        )

class ArbitrageOpportunityDetector:
    def __init__(self):
        self.price_history = defaultdict(lambda: deque(maxlen=1000))
        self.liquidity_history = defaultdict(lambda: deque(maxlen=1000))
        self.volatility_tracker = VolatilityTracker()
        self.correlation_analyzer = CrossAssetCorrelationAnalyzer()
        
        # Load pre-trained models
        self.deep_detector = DeepArbitrageDetector(num_tokens=100)
        self.deep_detector.load_state_dict(
            torch.load('models/arbitrage_detector_v3.pt')
        )
        self.deep_detector.eval()

        # Initialize market impact predictor
        self.impact_predictor = MarketImpactPredictor()
        
        # Set up real-time monitoring
        self.pool_monitor = PoolStateMonitor()
        self.mempool_monitor = MempoolMonitor()

    async def detect_opportunities(
        self,
        prices: Dict[str, float],
        pools: List[Dict],
        gas_price: int
    ) -> List[ArbitrageOpportunity]:
        """Detect arbitrage opportunities using ML models"""
        
        # Update historical data
        self._update_histories(prices, pools)
        
        # Get market conditions
        volatility = self.volatility_tracker.get_current_volatility()
        correlations = self.correlation_analyzer.get_correlations()
        
        # Create feature matrix
        features = self._create_feature_matrix(
            prices=prices,
            pools=pools,
            volatility=volatility,
            correlations=correlations
        )
        
        # Run deep learning model
        with torch.no_grad():
            predictions = self.deep_detector(
                torch.FloatTensor(features).unsqueeze(0)
            )
            profit_potential, confidence, risk = predictions[0].numpy()

        # Find potential paths
        paths = await self._find_profitable_paths(
            prices=prices,
            pools=pools,
            min_profit_potential=profit_potential
        )

        opportunities = []
        for path in paths:
            # Simulate market impact
            impact = await self.impact_predictor.predict_impact(
                path=path,
                pools=pools,
                gas_price=gas_price
            )
            
            # Calculate optimal amount
            optimal_amount = self._calculate_optimal_amount(
                path=path,
                pools=pools,
                impact=impact
            )
            
            # Estimate execution time
            exec_time = self._estimate_execution_time(path, gas_price)
            
            if impact['total_impact'] < 0.02:  # Less than 2% impact
                opportunities.append(ArbitrageOpportunity(
                    path=path,
                    expected_profit=impact['expected_profit'],
                    confidence=confidence * (1 - impact['uncertainty']),
                    required_amount=optimal_amount,
                    risk_score=risk + impact['risk_contribution'],
                    execution_time_ms=exec_time,
                    pool_impacts=impact['pool_impacts']
                ))

        # Sort by risk-adjusted profit
        opportunities.sort(
            key=lambda x: x.expected_profit * (1 - x.risk_score),
            reverse=True
        )

        return opportunities

    async def _find_profitable_paths(
        self,
        prices: Dict[str, float],
        pools: List[Dict],
        min_profit_potential: float
    ) -> List[List[Dict]]:
        """Find profitable trading paths using graph algorithms"""
        paths = []
        
        # Build adjacency matrix from pools
        graph = self._build_graph(pools)
        
        # Get potential starting tokens
        start_tokens = self._get_high_volume_tokens(pools)
        
        for start_token in start_tokens:
            # Use Bellman-Ford to find negative weight cycles
            cycles = self._find_negative_cycles(
                graph=graph,
                start=start_token,
                prices=prices
            )
            
            for cycle in cycles:
                path_info = self._build_path_info(cycle, pools)
                
                # Check mempool for competing transactions
                competing_txs = await self.mempool_monitor.get_competing_txs(
                    path_info
                )
                
                if not competing_txs:
                    paths.append(path_info)

        return paths

    def _calculate_optimal_amount(
        self,
        path: List[Dict],
        pools: List[Dict],
        impact: Dict
    ) -> float:
        """Calculate optimal trade amount using convex optimization"""
        
        def objective(amount):
            """Objective function to maximize profit"""
            current_amount = amount
            total_impact = 0
            
            for i, step in enumerate(path):
                pool = pools[i]
                impact_ratio = impact['pool_impacts'][pool['address']]
                
                # Calculate output with slippage
                slippage = impact_ratio * (current_amount / pool['liquidity'])
                output = current_amount * (1 - slippage)
                
                current_amount = output
                total_impact += slippage

            # Return negative profit (for minimization)
            return -(current_amount - amount)

        # Find optimal amount using scipy
        result = minimize(
            objective,
            x0=[1000.0],  # Initial guess
            bounds=[(100.0, 1000000.0)],  # Min/max amounts
            method='SLSQP'
        )

        if result.success:
            return float(result.x[0])
        else:
            return 0.0

    async def monitor_opportunities(self, tokens: List[str]):
        """Continuously monitor for arbitrage opportunities"""
        while True:
            try:
                # Get latest market data
                prices = await self.pool_monitor.get_latest_prices(tokens)
                pools = await self.pool_monitor.get_pools_state(tokens)
                gas_price = await self.gas_tracker.get_fast_gas_price()
                
                # Detect opportunities
                opportunities = await self.detect_opportunities(
                    prices=prices,
                    pools=pools,
                    gas_price=gas_price
                )
                
                # Filter high confidence opportunities
                good_opportunities = [
                    opp for opp in opportunities
                    if opp.confidence > 0.8 and opp.risk_score < 0.3
                ]
                
                if good_opportunities:
                    # Emit opportunities to execution engine
                    await self.opportunity_queue.put(good_opportunities)
                
                # Brief pause to avoid overwhelming the network
                await asyncio.sleep(0.1)
                
            except Exception as e:
                logger.error(f"Error in opportunity monitor: {str(e)}")
                await asyncio.sleep(1)

    def _build_graph(self, pools: List[Dict]) -> nx.DiGraph:
        """Build weighted directed graph from pool data"""
        G = nx.DiGraph()
        
        for pool in pools:
            token0, token1 = pool['token0'], pool['token1']
            reserve0, reserve1 = pool['reserve0'], pool['reserve1']
            
            # Add forward and reverse edges with weights
            weight_forward = -np.log(reserve1 / reserve0)
            weight_reverse = -np.log(reserve0 / reserve1)
            
            G.add_edge(token0, token1, 
                      weight=weight_forward,
                      pool=pool['address'])
            G.add_edge(token1, token0, 
                      weight=weight_reverse,
                      pool=pool['address'])
            
        return G

    def _find_negative_cycles(
        self,
        graph: nx.DiGraph,
        start: str,
        prices: Dict[str, float]
    ) -> List[List[str]]:
        """Find negative cycles using Bellman-Ford"""
        cycles = []
        distances = defaultdict(lambda: float('inf'))
        distances[start] = 0
        predecessors = {start: None}
        
        # Run V-1 iterations
        for _ in range(len(graph) - 1):
            for u, v in graph.edges():
                weight = graph[u][v]['weight']
                if distances[u] + weight < distances[v]:
                    distances[v] = distances[u] + weight
                    predecessors[v] = u
        
        # Check for negative cycles
        for u, v in graph.edges():
            weight = graph[u][v]['weight']
            if distances[u] + weight < distances[v]:
                # Negative cycle found
                cycle = []
                current = v
                for _ in range(len(graph)):
                    cycle.append(current)
                    current = predecessors[current]
                    if current in cycle:
                        idx = cycle.index(current)
                        cycles.append(cycle[idx:])
                        break
        
        return cycles

    @torch.no_grad()
    def _create_feature_matrix(
        self,
        prices: Dict[str, float],
        pools: List[Dict],
        volatility: float,
        correlations: np.ndarray
    ) -> np.ndarray:
        """Create feature matrix for ML model"""
        # Convert market data to tensors
        price_matrix = self._create_price_matrix(prices)
        liquidity_matrix = self._create_liquidity_matrix(pools)
        
        # Add volatility features
        vol_features = torch.tensor(volatility).expand(1, -1)
        
        # Add correlation features
        corr_features = torch.tensor(correlations).flatten()
        
        # Combine features
        return torch.cat([
            price_matrix,
            liquidity_matrix,
            vol_features,
            corr_features
        ], dim=1)