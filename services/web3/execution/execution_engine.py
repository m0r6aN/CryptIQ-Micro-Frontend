# File: services/trading-service/execution/smart_executor.py

import asyncio
from typing import Dict, List, Optional
from decimal import Decimal
import numpy as np
import torch
from web3 import AsyncWeb3
from web3.exceptions import ContractLogicError

from ..models.impact_networks import ImpactTransformer
from ..ml.arbitrage.impact_predictor import MarketImpactPredictor
from ..ml.arbitrage.training.impact_trainer import ImpactModelTrainer
from ..utils.gas import GasOptimizer
from ..utils.logger import get_logger
from ..monitoring import AlertSystem

logger = get_logger(__name__)

class SmartExecutionEngine:
    def __init__(
        self,
        web3: AsyncWeb3,
        impact_predictor: MarketImpactPredictor,
        trainer: ImpactModelTrainer,
        gas_optimizer: GasOptimizer,
        alert_system: AlertSystem,
        min_profit_threshold: float = 100.0,  # $100 minimum profit
        max_slippage: float = 0.02,  # 2% max slippage
        confidence_threshold: float = 0.8  # 80% confidence minimum
    ):
        self.w3 = web3
        self.impact_predictor = impact_predictor
        self.trainer = trainer
        self.gas_optimizer = gas_optimizer
        self.alert_system = alert_system
        
        self.min_profit = min_profit_threshold
        self.max_slippage = max_slippage
        self.confidence_threshold = confidence_threshold
        
        # Track execution statistics
        self.execution_stats = {
            'total_executions': 0,
            'successful_executions': 0,
            'failed_executions': 0,
            'total_profit': Decimal('0'),
            'total_gas_spent': Decimal('0'),
            'average_slippage': Decimal('0')
        }

    async def execute_arbitrage(
        self,
        opportunity: Dict,
        dry_run: bool = False
    ) -> Dict:
        """Execute arbitrage with smart timing and sizing"""
        try:
            # Predict market impact
            impact = await self.impact_predictor.predict_impact(
                path=opportunity['path'],
                pools=opportunity['pools'],
                gas_price=await self.gas_optimizer.get_fast_gas_price()
            )
            
            # Check if opportunity is still profitable after impact
            adjusted_profit = opportunity['profitUSD'] * (1 - impact.total_impact)
            if adjusted_profit < self.min_profit:
                logger.info(f"Opportunity no longer profitable after impact: ${adjusted_profit}")
                return {'success': False, 'reason': 'insufficient_profit'}

            # Time the execution
            execution_time = await self._find_optimal_execution_time(
                opportunity=opportunity,
                impact=impact
            )
            
            if execution_time > 0:
                logger.info(f"Waiting {execution_time}s for optimal execution...")
                await asyncio.sleep(execution_time)

            # Get optimal trade sizing
            optimal_amounts = self._calculate_optimal_amounts(
                opportunity=opportunity,
                impact=impact
            )

            if dry_run:
                return {
                    'success': True,
                    'would_execute': True,
                    'expected_profit': adjusted_profit,
                    'optimal_amounts': optimal_amounts,
                    'impact_prediction': impact
                }

            # Execute the trade
            result = await self._execute_trade(
                opportunity=opportunity,
                amounts=optimal_amounts,
                impact=impact
            )

            # Learn from execution
            await self._learn_from_execution(
                opportunity=opportunity,
                impact=impact,
                result=result
            )

            return result

        except Exception as e:
            logger.error(f"Execution failed: {str(e)}")
            await self.alert_system.send_alert(
                level='error',
                title='Arbitrage Execution Failed',
                message=str(e)
            )
            return {'success': False, 'error': str(e)}

    async def _find_optimal_execution_time(
        self,
        opportunity: Dict,
        impact: Dict
    ) -> float:
        """Find optimal timing for trade execution"""
        # Get current block timing
        block_time = await self.w3.eth.get_block('latest')
        next_block_time = block_time['timestamp'] + 12  # Assume 12s block time
        
        # Check mempool congestion
        mempool_density = await self._analyze_mempool(opportunity['path'])
        
        # Check if we should wait for better conditions
        if mempool_density > 0.8:  # High mempool congestion
            # Wait for clearer mempool
            return 12.0  # Wait one block
            
        # Check price movement momentum
        price_momentum = await self._calculate_price_momentum(
            opportunity['path']
        )
        
        if abs(price_momentum) > 0.02:  # 2% price movement
            # Wait for price to stabilize
            return 6.0  # Wait half block
            
        # Check if impact reversal time is worth waiting for
        if impact.reversal_time < 30:  # 30s threshold
            return impact.reversal_time
            
        return 0  # Execute immediately

    def _calculate_optimal_amounts(
        self,
        opportunity: Dict,
        impact: Dict
    ) -> List[Decimal]:
        """Calculate optimal amounts for each swap in path"""
        amounts = []
        current_amount = opportunity['required_amount']
        
        for i, step in enumerate(opportunity['path']):
            pool_impact = impact.pool_impacts.get(step['pool'], 0)
            
            # Apply dynamic slippage buffer based on impact
            slippage_buffer = max(
                self.max_slippage,
                pool_impact * 2  # 2x impact as buffer
            )
            
            # Calculate minimum output
            min_output = current_amount * (1 - slippage_buffer)
            amounts.append(min_output)
            
            # Update amount for next step
            current_amount = min_output * (1 - step.get('fee', 0))
            
        return amounts

    async def _execute_trade(
        self,
        opportunity: Dict,
        amounts: List[Decimal],
        impact: Dict
    ) -> Dict:
        """Execute the arbitrage trade"""
        try:
            # Get optimal gas price
            gas_price = await self.gas_optimizer.get_optimal_gas_price()
            
            # Build transaction
            tx = await self._build_arbitrage_tx(
                opportunity=opportunity,
                amounts=amounts,
                gas_price=gas_price
            )
            
            # Simulate transaction
            try:
                await self.w3.eth.call(tx)
            except ContractLogicError as e:
                logger.error(f"Transaction simulation failed: {str(e)}")
                return {'success': False, 'reason': 'simulation_failed'}

            # Send transaction
            signed_tx = await self.w3.eth.account.sign_transaction(
                tx,
                private_key=self.w3.eth.account.privateKey
            )
            
            tx_hash = await self.w3.eth.send_raw_transaction(
                signed_tx.rawTransaction
            )

            # Wait for confirmation with timeout
            try:
                receipt = await asyncio.wait_for(
                    self.w3.eth.wait_for_transaction_receipt(tx_hash),
                    timeout=30
                )
            except asyncio.TimeoutError:
                return {'success': False, 'reason': 'timeout'}

            # Parse execution results
            execution_results = self._parse_execution_results(receipt)
            
            # Update statistics
            self._update_execution_stats(
                success=receipt.status == 1,
                profit=execution_results.get('profit', 0),
                gas_used=receipt.gasUsed * gas_price,
                slippage=execution_results.get('slippage', 0)
            )

            return {
                'success': receipt.status == 1,
                'tx_hash': tx_hash.hex(),
                'gas_used': receipt.gasUsed,
                'gas_price': gas_price,
                'execution_results': execution_results
            }

        except Exception as e:
            logger.error(f"Trade execution failed: {str(e)}")
            return {'success': False, 'error': str(e)}

    async def _learn_from_execution(
        self,
        opportunity: Dict,
        impact: Dict,
        result: Dict
    ):
        """Learn from execution results to improve future predictions"""
        if not result['success']:
            return

        # Calculate actual impact
        actual_impact = self._calculate_actual_impact(
            opportunity=opportunity,
            result=result
        )

        # Store experience in replay buffer
        self.trainer.store_experience(
            state={
                'pool_features': opportunity['pool_features'],
                'market_features': opportunity['market_features']
            },
            action={
                'amounts': opportunity['amounts'],
                'timing': opportunity['execution_time']
            },
            next_state=await self._get_current_market_state(),
            reward=result['execution_results']['profit'],
            done=True
        )

        # Periodically train models
        if self.execution_stats['total_executions'] % 10 == 0:
            metrics = await self.trainer.train_step()
            logger.info(f"Training metrics: {metrics}")

    def _update_execution_stats(
        self,
        success: bool,
        profit: Decimal,
        gas_used: Decimal,
        slippage: float
    ):
        """Update execution statistics"""
        self.execution_stats['total_executions'] += 1
        if success:
            self.execution_stats['successful_executions'] += 1
            self.execution_stats['total_profit'] += profit
        else:
            self.execution_stats['failed_executions'] += 1

        self.execution_stats['total_gas_spent'] += gas_used
        
        # Update rolling average slippage
        n = self.execution_stats['total_executions']
        old_avg = self.execution_stats['average_slippage']
        self.execution_stats['average_slippage'] = (
            (old_avg * (n-1) + slippage) / n
        )

    async def get_execution_stats(self) -> Dict:
        """Get current execution statistics"""
        return {
            **self.execution_stats,
            'success_rate': (
                self.execution_stats['successful_executions'] /
                max(1, self.execution_stats['total_executions'])
            ),
            'average_profit': (
                self.execution_stats['total_profit'] /
                max(1, self.execution_stats['successful_executions'])
            ),
            'average_gas': (
                self.execution_stats['total_gas_spent'] /
                max(1, self.execution_stats['total_executions'])
            )
        }
