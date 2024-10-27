# File: services/monitoring-service/monitor_service.py

import asyncio
import json
from typing import Dict, Set, Optional
from dataclasses import dataclass
from datetime import datetime, timedelta
import numpy as np
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import websockets
from redis.asyncio import Redis

@dataclass
class MetricWindow:
    size: int
    data: np.ndarray
    timestamps: np.ndarray

    def add(self, value: float, timestamp: float):
        self.data = np.roll(self.data, -1)
        self.timestamps = np.roll(self.timestamps, -1)
        self.data[-1] = value
        self.timestamps[-1] = timestamp

    def get_stats(self) -> Dict:
        return {
            'mean': float(np.mean(self.data)),
            'std': float(np.std(self.data)),
            'min': float(np.min(self.data)),
            'max': float(np.max(self.data)),
            'latest': float(self.data[-1])
        }

class MonitoringService:
    def __init__(self):
        self.app = FastAPI()
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
        
        # Active WebSocket connections
        self.connections: Set[WebSocket] = set()
        
        # Redis for pub/sub
        self.redis = Redis(host='redis', port=6379, decode_responses=True)
        
        # Metric Windows
        self.windows = {
            'profits': MetricWindow(size=1000, data=np.zeros(1000), timestamps=np.zeros(1000)),
            'impact': MetricWindow(size=1000, data=np.zeros(1000), timestamps=np.zeros(1000)),
            'timing': MetricWindow(size=1000, data=np.zeros(1000), timestamps=np.zeros(1000))
        }
        
        # Performance trackers
        self.model_metrics = {
            'impact_accuracy': [],
            'reversal_accuracy': [],
            'confidence_scores': [],
            'learning_progress': 0.0
        }
        
        # System health monitoring
        self.system_health = {
            'service_status': {},
            'agent_health': {},
            'resource_usage': {}
        }
        
        self._setup_routes()
        self._start_background_tasks()

    def _setup_routes(self):
        @self.app.websocket("/ws")
        async def websocket_endpoint(websocket: WebSocket):
            await self.handle_websocket_connection(websocket)

        @self.app.get("/health")
        async def health_check():
            return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

    def _start_background_tasks(self):
        asyncio.create_task(self.monitor_services())
        asyncio.create_task(self.aggregate_metrics())
        asyncio.create_task(self.subscribe_to_events())

    async def handle_websocket_connection(self, websocket: WebSocket):
        """Handle new WebSocket connections"""
        await websocket.accept()
        self.connections.add(websocket)
        
        try:
            # Send initial state
            await websocket.send_json({
                'type': 'INITIAL_STATE',
                'data': {
                    'profits': self.windows['profits'].get_stats(),
                    'model_metrics': self.model_metrics,
                    'system_health': self.system_health
                }
            })
            
            # Keep connection alive
            while True:
                data = await websocket.receive_text()
                if data == "ping":
                    await websocket.send_text("pong")
                
        except websockets.exceptions.ConnectionClosed:
            pass
        finally:
            self.connections.remove(websocket)

    async def broadcast_update(self, message: Dict):
        """Broadcast update to all connected clients"""
        dead_connections = set()
        
        for connection in self.connections:
            try:
                await connection.send_json(message)
            except websockets.exceptions.ConnectionClosed:
                dead_connections.add(connection)
        
        # Clean up dead connections
        self.connections -= dead_connections

    async def subscribe_to_events(self):
        """Subscribe to various service events"""
        pubsub = self.redis.pubsub()
        await pubsub.subscribe(
            'trade_executions',
            'model_updates',
            'system_alerts',
            'agent_status'
        )
        
        async for message in pubsub.listen():
            if message['type'] == 'message':
                data = json.loads(message['data'])
                
                if message['channel'] == 'trade_executions':
                    await self.handle_trade_execution(data)
                elif message['channel'] == 'model_updates':
                    await self.handle_model_update(data)
                elif message['channel'] == 'system_alerts':
                    await self.handle_system_alert(data)
                elif message['channel'] == 'agent_status':
                    await self.handle_agent_status(data)

    async def handle_trade_execution(self, data: Dict):
        """Process trade execution data"""
        timestamp = datetime.utcnow().timestamp()
        
        # Update profit window
        self.windows['profit'].add(
            value=data['profit'],
            timestamp=timestamp
        )
        
        # Update impact window
        if 'market_impact' in data:
            self.windows['impact'].add(
                value=data['market_impact'],
                timestamp=timestamp
            )
        
        # Calculate trading metrics
        metrics = self._calculate_trading_metrics(data)
        
        # Broadcast update
        await self.broadcast_update({
            'type': 'EXECUTION_UPDATE',
            'data': {
                'execution': data,
                'metrics': metrics,
                'windows': {
                    name: window.get_stats()
                    for name, window in self.windows.items()
                }
            }
        })

    async def handle_model_update(self, data: Dict):
        """Process ML model performance updates"""
        # Update model metrics
        if 'impact_accuracy' in data:
            self.model_metrics['impact_accuracy'].append(data['impact_accuracy'])
        if 'reversal_accuracy' in data:
            self.model_metrics['reversal_accuracy'].append(data['reversal_accuracy'])
        if 'confidence' in data:
            self.model_metrics['confidence_scores'].append(data['confidence'])
        
        # Calculate learning progress
        self.model_metrics['learning_progress'] = self._calculate_learning_progress()
        
        # Broadcast update
        await self.broadcast_update({
            'type': 'MODEL_UPDATE',
            'data': {
                'metrics': self.model_metrics,
                'update': data
            }
        })

    async def handle_system_alert(self, alert: Dict):
        """Process system alerts"""
        await self.broadcast_update({
            'type': 'SYSTEM_ALERT',
            'data': alert
        })

    async def monitor_services(self):
        """Monitor health of all services"""
        while True:
            try:
                # Check service health
                services = [
                    'trading-service',
                    'portfolio-service',
                    'market-analysis-service',
                    'risk-management-service'
                ]
                
                for service in services:
                    try:
                        async with websockets.connect(f'ws://{service}:5000/health') as ws:
                            self.system_health['service_status'][service] = 'healthy'
                    except:
                        self.system_health['service_status'][service] = 'unhealthy'
                
                # Monitor resource usage
                self.system_health['resource_usage'] = await self._get_resource_usage()
                
                # Broadcast health update
                await self.broadcast_update({
                    'type': 'HEALTH_UPDATE',
                    'data': self.system_health
                })
                
            except Exception as e:
                print(f"Error monitoring services: {str(e)}")
            
            await asyncio.sleep(5)  # Check every 5 seconds

    async def aggregate_metrics(self):
        """Aggregate and compute derived metrics"""
        while True:
            try:
                # Calculate performance metrics
                performance_metrics = {
                    'profit_metrics': self._calculate_profit_metrics(),
                    'impact_metrics': self._calculate_impact_metrics(),
                    'timing_metrics': self._calculate_timing_metrics()
                }
                
                # Broadcast metrics
                await self.broadcast_update({
                    'type': 'METRICS_UPDATE',
                    'data': performance_metrics
                })
                
            except Exception as e:
                print(f"Error aggregating metrics: {str(e)}")
            
            await asyncio.sleep(1)  # Update every second

    def _calculate_profit_metrics(self) -> Dict:
        """Calculate profit-related metrics"""
        profit_data = self.windows['profits'].data
        return {
            'total_profit': float(np.sum(profit_data)),
            'hourly_profit': float(np.sum(profit_data[-3600:])),
            'profit_volatility': float(np.std(profit_data)),
            'profit_trend': self._calculate_trend(profit_data),
            'sharpe_ratio': self._calculate_sharpe_ratio(profit_data)
        }

    def _calculate_impact_metrics(self) -> Dict:
        """Calculate market impact metrics"""
        impact_data = self.windows['impact'].data
        return {
            'average_impact': float(np.mean(impact_data)),
            'impact_volatility': float(np.std(impact_data)),
            'max_impact': float(np.max(impact_data)),
            'impact_correlation': float(
                np.corrcoef(impact_data, self.windows['profits'].data)[0,1]
            )
        }

    def _calculate_timing_metrics(self) -> Dict:
        """Calculate execution timing metrics"""
        timing_data = self.windows['timing'].data
        return {
            'average_timing': float(np.mean(timing_data)),
            'timing_accuracy': self._calculate_timing_accuracy(timing_data),
            'timing_efficiency': self._calculate_timing_efficiency(timing_data)
        }

    def _calculate_learning_progress(self) -> float:
        """Calculate ML model learning progress"""
        if not self.model_metrics['impact_accuracy']:
            return 0.0
            
        # Use exponential moving average
        alpha = 0.1
        accuracies = np.array(self.model_metrics['impact_accuracy'])
        weights = np.exp(-alpha * np.arange(len(accuracies)))
        weighted_accuracy = np.sum(accuracies * weights) / np.sum(weights)
        
        # Normalize to [0, 1]
        return min(1.0, weighted_accuracy / 0.95)  # 95% is considered fully learned

    @staticmethod
    def _calculate_trend(data: np.ndarray, window: int = 100) -> float:
        """Calculate trend using linear regression"""
        if len(data) < window:
            return 0.0
            
        recent_data = data[-window:]
        x = np.arange(window)
        coeffs = np.polyfit(x, recent_data, deg=1)
        return float(coeffs[0])  # Return slope

    @staticmethod
    def _calculate_sharpe_ratio(returns: np.ndarray) -> float:
        """Calculate Sharpe ratio of returns"""
        if len(returns) < 2:
            return 0.0
            
        return float(np.mean(returns) / (np.std(returns) + 1e-6))

    @staticmethod
    async def _get_resource_usage() -> Dict:
        """Get system resource usage"""
        # This would interface with your container metrics
        return {
            'cpu_usage': 0.0,  # Placeholder
            'memory_usage': 0.0,  # Placeholder
            'network_usage': 0.0  # Placeholder
        }

if __name__ == "__main__":
    monitor = MonitoringService()
    uvicorn.run(monitor.app, host="0.0.0.0", port=5000)
