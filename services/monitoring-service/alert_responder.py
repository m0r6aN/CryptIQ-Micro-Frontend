# File: services/monitoring-service/alert_responder.py

import asyncio
from dataclasses import dataclass
from datetime import datetime
from typing import Dict, List, Optional, Callable
from enum import Enum
import numpy as np
from web3 import AsyncWeb3

class AlertSeverity(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

@dataclass
class ResponseAction:
    name: str
    severity_threshold: AlertSeverity
    cooldown: int
    action: Callable
    requires_approval: bool
    auto_revert: bool
    max_retry: int

class AutomatedResponseSystem:
    def __init__(
        self,
        web3: AsyncWeb3,
        trade_executor,
        model_trainer,
        risk_manager
    ):
        self.w3 = web3
        self.trade_executor = trade_executor
        self.model_trainer = model_trainer
        self.risk_manager = risk_manager
        
        # Initialize response actions
        self.response_actions = self._setup_response_actions()
        
        # Track action history
        self.action_history: Dict[str, List[datetime]] = {}
        
        # Active mitigations
        self.active_mitigations: Dict[str, dict] = {}

    def _setup_response_actions(self) -> Dict[str, ResponseAction]:
        """Set up automated response actions"""
        return {
            # Trading Performance Responses
            'adjust_position_sizes': ResponseAction(
                name="Adjust Position Sizes",
                severity_threshold=AlertSeverity.MEDIUM,
                cooldown=300,  # 5 minutes
                action=self._adjust_position_sizes,
                requires_approval=False,
                auto_revert=True,
                max_retry=3
            ),
            'pause_trading': ResponseAction(
                name="Pause Trading",
                severity_threshold=AlertSeverity.HIGH,
                cooldown=600,  # 10 minutes
                action=self._pause_trading,
                requires_approval=True,
                auto_revert=False,
                max_retry=1
            ),

            # Market Impact Responses
            'optimize_execution': ResponseAction(
                name="Optimize Execution",
                severity_threshold=AlertSeverity.LOW,
                cooldown=60,
                action=self._optimize_execution_strategy,
                requires_approval=False,
                auto_revert=True,
                max_retry=5
            ),
            'switch_dex_routes': ResponseAction(
                name="Switch DEX Routes",
                severity_threshold=AlertSeverity.MEDIUM,
                cooldown=120,
                action=self._switch_dex_routes,
                requires_approval=False,
                auto_revert=True,
                max_retry=3
            ),

            # Model Performance Responses
            'retrain_model': ResponseAction(
                name="Retrain Model",
                severity_threshold=AlertSeverity.MEDIUM,
                cooldown=1800,  # 30 minutes
                action=self._retrain_model,
                requires_approval=False,
                auto_revert=False,
                max_retry=2
            ),
            'fallback_strategy': ResponseAction(
                name="Activate Fallback Strategy",
                severity_threshold=AlertSeverity.HIGH,
                cooldown=900,  # 15 minutes
                action=self._activate_fallback_strategy,
                requires_approval=True,
                auto_revert=True,
                max_retry=1
            ),

            # System Responses
            'scale_resources': ResponseAction(
                name="Scale Computing Resources",
                severity_threshold=AlertSeverity.LOW,
                cooldown=300,
                action=self._scale_resources,
                requires_approval=False,
                auto_revert=True,
                max_retry=3
            ),
            'emergency_shutdown': ResponseAction(
                name="Emergency Shutdown",
                severity_threshold=AlertSeverity.CRITICAL,
                cooldown=0,  # No cooldown for emergencies
                action=self._emergency_shutdown,
                requires_approval=True,
                auto_revert=False,
                max_retry=1
            )
        }

    async def handle_alert(self, alert: Dict):
        """Handle incoming alert and trigger appropriate response"""
        severity = AlertSeverity(alert['severity'])
        
        # Get applicable responses
        responses = [
            action for action in self.response_actions.values()
            if severity >= action.severity_threshold
        ]
        
        for response in responses:
            if not self._is_in_cooldown(response.name):
                should_execute = True
                
                # Check if approval needed
                if response.requires_approval:
                    should_execute = await self._get_approval(
                        response.name,
                        alert
                    )
                
                if should_execute:
                    await self._execute_response(response, alert)

    async def _execute_response(
        self,
        response: ResponseAction,
        alert: Dict
    ):
        """Execute response action with retry logic"""
        for attempt in range(response.max_retry):
            try:
                result = await response.action(alert)
                
                if result['success']:
                    # Record action
                    self._record_action(response.name)
                    
                    # Track active mitigation
                    if response.auto_revert:
                        self.active_mitigations[response.name] = {
                            'alert': alert,
                            'timestamp': datetime.utcnow(),
                            'revert_after': datetime.utcnow().timestamp() + 3600  # 1 hour default
                        }
                    
                    return result
                
            except Exception as e:
                print(f"Response {response.name} failed attempt {attempt + 1}: {str(e)}")
                
            # Wait before retry
            await asyncio.sleep(2 ** attempt)
        
        return {'success': False, 'error': 'Max retries exceeded'}

    async def _adjust_position_sizes(self, alert: Dict) -> Dict:
        """Dynamically adjust position sizes based on market conditions"""
        try:
            # Calculate new position size multiplier
            current_profit = alert['data']['current_profit']
            expected_profit = alert['data']['expected_profit']
            
            adjustment_ratio = current_profit / expected_profit
            new_multiplier = max(0.3, min(1.0, adjustment_ratio))
            
            # Apply new position sizes
            await self.risk_manager.update_position_multiplier(new_multiplier)
            
            return {
                'success': True,
                'new_multiplier': new_multiplier
            }
            
        except Exception as e:
            return {'success': False, 'error': str(e)}

    async def _optimize_execution_strategy(self, alert: Dict) -> Dict:
        """Optimize trade execution strategy"""
        try:
            impact_data = alert['data']
            
            # Update execution parameters
            new_params = {
                'slippage_tolerance': impact_data['current'] * 1.5,
                'min_liquidity_ratio': 0.1,
                'max_market_impact': impact_data['threshold'],
                'execution_delay': 2  # seconds
            }
            
            await self.trade_executor.update_execution_params(new_params)
            
            return {
                'success': True,
                'new_params': new_params
            }
            
        except Exception as e:
            return {'success': False, 'error': str(e)}

    async def _switch_dex_routes(self, alert: Dict) -> Dict:
        """Switch to alternate DEX routes"""
        try:
            # Get current route
            current_route = alert['data'].get('current_route', [])
            
            # Find alternate routes
            alternate_routes = await self.trade_executor.find_alternate_routes(
                excluding=current_route
            )
            
            if alternate_routes:
                # Switch to best alternate route
                await self.trade_executor.set_preferred_route(
                    alternate_routes[0]
                )
                
                return {
                    'success': True,
                    'new_route': alternate_routes[0]
                }
            
            return {
                'success': False,
                'error': 'No alternate routes available'
            }
            
        except Exception as e:
            return {'success': False, 'error': str(e)}

    async def _retrain_model(self, alert: Dict) -> Dict:
        """Retrain ML models with recent data"""
        try:
            # Get recent training data
            recent_data = await self.model_trainer.get_recent_data(
                hours=24
            )
            
            # Start retraining
            training_task = await self.model_trainer.start_training(
                data=recent_data,
                epochs=100,
                batch_size=64
            )
            
            # Wait for completion
            result = await training_task
            
            return {
                'success': True,
                'new_accuracy': result['accuracy'],
                'training_time': result['training_time']
            }
            
        except Exception as e:
            return {'success': False, 'error': str(e)}

    async def _emergency_shutdown(self, alert: Dict) -> Dict:
        """Emergency system shutdown"""
        try:
            # Close all open positions
            await self.trade_executor.close_all_positions(
                max_slippage=0.1  # 10% max slippage in emergency
            )
            
            # Disable trading
            await self.trade_executor.disable_trading()
            
            # Cancel all pending transactions
            await self.trade_executor.cancel_pending_transactions()
            
            return {
                'success': True,
                'shutdown_time': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def _is_in_cooldown(self, action_name: str) -> bool:
        """Check if action is in cooldown period"""
        if action_name not in self.action_history:
            return False
            
        last_action = self.action_history[action_name][-1]
        cooldown = self.response_actions[action_name].cooldown
        
        return (datetime.utcnow() - last_action).seconds < cooldown

    async def check_active_mitigations(self):
        """Check and revert temporary mitigations"""
        current_time = datetime.utcnow().timestamp()
        
        for action_name, mitigation in list(self.active_mitigations.items()):
            if current_time > mitigation['revert_after']:
                response = self.response_actions[action_name]
                
                # Revert action
                await self._revert_action(
                    action_name,
                    mitigation['alert']
                )
                
                del self.active_mitigations[action_name]

    async def _revert_action(self, action_name: str, original_alert: Dict):
        """Revert temporary mitigation action"""
        revert_functions = {
            'adjust_position_sizes': self._revert_position_adjustment,
            'optimize_execution': self._revert_execution_optimization,
            'switch_dex_routes': self._revert_route_switch
        }
        
        if action_name in revert_functions:
            await revert_functions[action_name](original_alert)

    def _record_action(self, action_name: str):
        """Record action execution time"""
        if action_name not in self.action_history:
            self.action_history[action_name] = []
            
        self.action_history[action_name].append(datetime.utcnow())

