# File: services/monitoring-service/neural_alerts.py

import asyncio
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Set
import numpy as np
from sklearn.ensemble import IsolationForest
import torch
import torch.nn as nn
from redis.asyncio import Redis

@dataclass
class AlertConfig:
    severity: str
    threshold: float
    lookback_window: int
    cooldown: int
    channels: List[str]

class AnomalyDetector(nn.Module):
    def __init__(self, input_size: int, hidden_size: int = 64):
        super().__init__()
        
        self.encoder = nn.Sequential(
            nn.Linear(input_size, hidden_size),
            nn.ReLU(),
            nn.Linear(hidden_size, hidden_size // 2),
            nn.ReLU()
        )
        
        self.decoder = nn.Sequential(
            nn.Linear(hidden_size // 2, hidden_size),
            nn.ReLU(),
            nn.Linear(hidden_size, input_size)
        )
        
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        encoded = self.encoder(x)
        decoded = self.decoder(encoded)
        return decoded

class NeuralAlertSystem:
    def __init__(self, redis_client: Redis):
        self.redis = redis_client
        
        # Initialize alert configurations
        self.alert_configs = {
            'profit_decline': AlertConfig(
                severity='high',
                threshold=-0.1,  # 10% decline
                lookback_window=100,
                cooldown=300,  # 5 minutes
                channels=['slack', 'email', 'dashboard']
            ),
            'impact_spike': AlertConfig(
                severity='medium',
                threshold=0.05,  # 5% impact
                lookback_window=50,
                cooldown=60,
                channels=['dashboard', 'slack']
            ),
            'model_degradation': AlertConfig(
                severity='high',
                threshold=0.15,  # 15% accuracy drop
                lookback_window=200,
                cooldown=600,
                channels=['slack', 'email', 'dashboard']
            ),
            'system_anomaly': AlertConfig(
                severity='critical',
                threshold=0.95,  # 95% anomaly score
                lookback_window=500,
                cooldown=30,
                channels=['slack', 'email', 'dashboard', 'pager']
            )
        }
        
        # Initialize anomaly detectors
        self.anomaly_detector = AnomalyDetector(
            input_size=10  # 10 key metrics
        )
        self.isolation_forest = IsolationForest(
            contamination=0.1,
            random_state=42
        )
        
        # Track alert history
        self.alert_history: Dict[str, List[datetime]] = {
            alert_type: [] for alert_type in self.alert_configs
        }
        
        # Active alert tracking
        self.active_alerts: Set[str] = set()
        
        # Metric windows for analysis
        self.metric_windows: Dict[str, np.ndarray] = {}
        
        # Initialize neural network for pattern detection
        self.pattern_detector = self._initialize_pattern_detector()

    async def start(self):
        """Start the alert monitoring system"""
        await asyncio.gather(
            self.monitor_profits(),
            self.monitor_market_impact(),
            self.monitor_model_performance(),
            self.monitor_system_health(),
            self.detect_anomalies()
        )

    async def monitor_profits(self):
        """Monitor profit metrics and detect issues"""
        while True:
            try:
                # Get latest profit data
                profit_data = await self._get_profit_metrics()
                
                # Check for profit decline
                if self._detect_profit_decline(profit_data):
                    await self._trigger_alert(
                        alert_type='profit_decline',
                        message="Significant profit decline detected",
                        data={
                            'decline_rate': float(profit_data['decline_rate']),
                            'current_profit': float(profit_data['current']),
                            'expected_profit': float(profit_data['expected'])
                        }
                    )

                # Check for unusual profit patterns
                pattern_score = self._analyze_profit_pattern(profit_data['history'])
                if pattern_score > self.alert_configs['profit_decline'].threshold:
                    await self._trigger_alert(
                        alert_type='profit_pattern',
                        message="Unusual profit pattern detected",
                        data={'pattern_score': float(pattern_score)}
                    )

            except Exception as e:
                print(f"Error monitoring profits: {str(e)}")
            
            await asyncio.sleep(1)

    async def monitor_market_impact(self):
        """Monitor market impact and slippage"""
        while True:
            try:
                # Get latest impact data
                impact_data = await self._get_impact_metrics()
                
                # Check for impact spikes
                if impact_data['current'] > self.alert_configs['impact_spike'].threshold:
                    await self._trigger_alert(
                        alert_type='impact_spike',
                        message="High market impact detected",
                        data={
                            'impact': float(impact_data['current']),
                            'threshold': float(self.alert_configs['impact_spike'].threshold)
                        }
                    )

                # Analyze impact patterns
                if self._detect_impact_pattern(impact_data['history']):
                    await self._trigger_alert(
                        alert_type='impact_pattern',
                        message="Concerning market impact pattern detected",
                        data={'pattern': 'increasing_impact'}
                    )

            except Exception as e:
                print(f"Error monitoring market impact: {str(e)}")
            
            await asyncio.sleep(1)

    async def monitor_model_performance(self):
        """Monitor ML model performance metrics"""
        while True:
            try:
                # Get latest model metrics
                model_metrics = await self._get_model_metrics()
                
                # Check for model degradation
                if self._detect_model_degradation(model_metrics):
                    await self._trigger_alert(
                        alert_type='model_degradation',
                        message="ML model performance degradation detected",
                        data={
                            'current_accuracy': float(model_metrics['accuracy']),
                            'baseline_accuracy': float(model_metrics['baseline']),
                            'degradation': float(model_metrics['degradation'])
                        }
                    )

                # Check for prediction confidence
                if model_metrics['confidence'] < 0.7:  # 70% confidence threshold
                    await self._trigger_alert(
                        alert_type='low_confidence',
                        message="Low model prediction confidence",
                        data={'confidence': float(model_metrics['confidence'])}
                    )

            except Exception as e:
                print(f"Error monitoring model performance: {str(e)}")
            
            await asyncio.sleep(5)

    async def detect_anomalies(self):
        """Run anomaly detection on system metrics"""
        while True:
            try:
                # Get latest system metrics
                metrics = await self._get_system_metrics()
                
                # Convert metrics to tensor
                metrics_tensor = torch.FloatTensor(metrics['values'])
                
                # Run through autoencoder
                with torch.no_grad():
                    reconstructed = self.anomaly_detector(metrics_tensor)
                    reconstruction_error = torch.mean(
                        (metrics_tensor - reconstructed) ** 2
                    ).item()

                # Run isolation forest
                isolation_score = self.isolation_forest.score_samples(
                    metrics['values'].reshape(1, -1)
                )[0]

                # Combine scores
                anomaly_score = self._combine_anomaly_scores(
                    reconstruction_error,
                    isolation_score
                )

                if anomaly_score > self.alert_configs['system_anomaly'].threshold:
                    await self._trigger_alert(
                        alert_type='system_anomaly',
                        message="System anomaly detected",
                        data={
                            'anomaly_score': float(anomaly_score),
                            'reconstruction_error': float(reconstruction_error),
                            'isolation_score': float(isolation_score)
                        }
                    )

            except Exception as e:
                print(f"Error detecting anomalies: {str(e)}")
            
            await asyncio.sleep(1)

    async def _trigger_alert(
        self,
        alert_type: str,
        message: str,
        data: Dict
    ):
        """Trigger an alert if cooldown has passed"""
        config = self.alert_configs[alert_type]
        
        # Check cooldown
        if self._is_in_cooldown(alert_type):
            return
            
        # Record alert
        self.alert_history[alert_type].append(datetime.utcnow())
        self.active_alerts.add(alert_type)
        
        # Prepare alert payload
        alert = {
            'type': alert_type,
            'severity': config.severity,
            'message': message,
            'data': data,
            'timestamp': datetime.utcnow().isoformat()
        }
        
        # Distribute alert to configured channels
        for channel in config.channels:
            await self._send_alert_to_channel(channel, alert)

    def _is_in_cooldown(self, alert_type: str) -> bool:
        """Check if alert is in cooldown period"""
        if not self.alert_history[alert_type]:
            return False
            
        last_alert = self.alert_history[alert_type][-1]
        cooldown = self.alert_configs[alert_type].cooldown
        
        return (datetime.utcnow() - last_alert).seconds < cooldown

    async def _send_alert_to_channel(
        self,
        channel: str,
        alert: Dict
    ):
        """Send alert to specific channel"""
        if channel == 'dashboard':
            await self.redis.publish(
                'system_alerts',
                json.dumps(alert)
            )
        elif channel == 'slack':
            await self._send_slack_alert(alert)
        elif channel == 'email':
            await self._send_email_alert(alert)
        elif channel == 'pager':
            await self._trigger_pager_duty(alert)

    def _detect_profit_decline(self, data: Dict) -> bool:
        """Detect significant profit decline"""
        if len(data['history']) < 2:
            return False
            
        return (data['current'] < data['expected'] * 0.9)  # 10% below expected

    def _detect_impact_pattern(self, history: np.ndarray) -> bool:
        """Detect concerning market impact patterns"""
        if len(history) < 10:
            return False
            
        # Calculate trend
        x = np.arange(len(history))
        slope = np.polyfit(x, history, 1)[0]
        
        return slope > 0.01  # 1% increase per sample

    def _detect_model_degradation(self, metrics: Dict) -> bool:
        """Detect ML model performance degradation"""
        return metrics['degradation'] > self.alert_configs['model_degradation'].threshold

    def _combine_anomaly_scores(
        self,
        reconstruction_error: float,
        isolation_score: float,
        alpha: float = 0.7
    ) -> float:
        """Combine different anomaly scores"""
        # Normalize isolation score to [0, 1]
        norm_isolation = (isolation_score + 1) / 2
        
        # Weighted combination
        return alpha * reconstruction_error + (1 - alpha) * (1 - norm_isolation)

    def _initialize_pattern_detector(self) -> nn.Module:
        """Initialize neural network for pattern detection"""
        return nn.Sequential(
            nn.Conv1d(1, 32, kernel_size=3),
            nn.ReLU(),
            nn.MaxPool1d(2),
            nn.Conv1d(32, 64, kernel_size=3),
            nn.ReLU(),
            nn.MaxPool1d(2),
            nn.Flatten(),
            nn.Linear(64 * 23, 128),
            nn.ReLU(),
            nn.Linear(128, 1),
            nn.Sigmoid()
        )

    async def _get_profit_metrics(self) -> Dict:
        """Get latest profit metrics from Redis"""
        data = await self.redis.get('profit_metrics')
        return json.loads(data) if data else {}

    async def _get_impact_metrics(self) -> Dict:
        """Get latest impact metrics from Redis"""
        data = await self.redis.get('impact_metrics')
        return json.loads(data) if data else {}

    async def _get_model_metrics(self) -> Dict:
        """Get latest model performance metrics from Redis"""
        data = await self.redis.get('model_metrics')
        return json.loads(data) if data else {}

    async def _get_system_metrics(self) -> Dict:
        """Get latest system metrics from Redis"""
        data = await self.redis.get('system_metrics')
        return json.loads(data) if data else {}

