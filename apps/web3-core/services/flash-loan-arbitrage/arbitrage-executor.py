from typing import List, Dict, Optional
from decimal import Decimal
import asyncio
from web3 import Web3, AsyncWeb3
from eth_typing import Address
import numpy as np

from .contracts import (
    load_contract_abi,
    get_network_contracts,
    encode_swap_data
)
from .price_feeds import PriceFeedAggregator
from .gas_oracle import GasOptimizer
from .defi_pools import LiquidityAggregator
from .utils.logger import get_logger

logger = get_logger(__name__)

class ArbitrageExecutor:
    def __init__(self, web3: AsyncWeb3):
        self.w3 = web3
        self.price_feeds = PriceFeedAggregator()
        self.gas_optimizer = GasOptimizer()
        self.liquidity_agg = LiquidityAggregator()
        
        # Load contract ABIs
        self.contracts = get_network_contracts(self.w3.eth.chain_id)
        self.flash_loan_abi = load_contract_abi('FlashLoanArbitrage')
        
        # Initialize contract instances
        self.arbitrage_contract = self.w3.eth.contract(
            address=self.contracts['arbitrage'],
            abi=self.flash_loan_abi
        )

    async def execute_arbitrage(
        self,
        path: List[Dict],
        amount: Decimal,
        min_profit: Decimal
    ) -> Dict:
        """Execute flash loan arbitrage through smart contract"""
        try:
            # Prepare swap data for each hop
            swap_params = []
            for hop in path:
                router_data = encode_swap_data(
                    dex=hop['protocol'],
                    token_in=hop['token_in'],
                    token_out=hop['token_out'],
                    amount_in=amount if len(swap_params) == 0 else None,
                    slippage=0.005  # 0.5% slippage per hop
                )
                
                swap_params.append({
                    'tokenIn': hop['token_in'],
                    'tokenOut': hop['token_out'],
                    'amountIn': amount if len(swap_params) == 0 else 0,
                    'minAmountOut': 0,  # Will be filled by contract
                    'path': [hop['token_in'], hop['token_out']],
                    'routerData': router_data
                })

            # Get optimal gas price
            gas_price = await self.gas_optimizer.get_optimal_gas_price()
            
            # Build transaction
            tx = await self.arbitrage_contract.functions.executeArbitrage(
                swap_params,
                amount,
                path[0]['token_in']
            ).build_transaction({
                'from': self.w3.eth.default_account,
                'gasPrice': gas_price,
                'nonce': await self.w3.eth.get_transaction_count(
                    self.w3.eth.default_account
                )
            })

            # Estimate gas and update
            gas_estimate = await self.w3.eth.estimate_gas(tx)
            tx['gas'] = int(gas_estimate * 1.1)  # Add 10% buffer

            # Sign and send transaction
            signed_tx = self.w3.eth.account.sign_transaction(
                tx, 
                private_key=self.w3.eth.account.default_account.key
            )
            tx_hash = await self.w3.eth.send_raw_transaction(
                signed_tx.rawTransaction
            )

            # Wait for confirmation
            receipt = await self.w3.eth.wait_for_transaction_receipt(
                tx_hash, 
                timeout=60
            )

            if receipt.status == 1:
                # Parse events to get profit
                profit = self._parse_profit_from_receipt(receipt)
                return {
                    'success': True,
                    'profit': profit,
                    'tx_hash': tx_hash.hex(),
                    'gas_used': receipt.gasUsed,
                    'gas_price': gas_price
                }
            else:
                raise Exception("Transaction failed")

        except Exception as e:
            logger.error(f"Arbitrage execution failed: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }

    async def monitor_opportunities(self, tokens: List[str]):
        """Monitor real-time arbitrage opportunities"""
        while True:
            try:
                # Get latest prices and liquidity
                prices = await self.price_feeds.get_latest_prices(tokens)
                pools = await self.liquidity_agg.get_pool_states(tokens)
                
                # Find opportunities
                opportunities = self._find_arbitrage_paths(
                    tokens=tokens,
                    prices=prices,
                    pools=pools
                )

                for opp in opportunities:
                    # Simulate execution
                    simulation = await self._simulate_arbitrage(opp)
                    
                    if simulation['profit'] > 0:
                        # Verify profitability after gas
                        gas_cost = await self._estimate_gas_cost(opp)
                        net_profit = simulation['profit'] - gas_cost
                        
                        if net_profit > 0:
                            logger.info(f"Executing arbitrage with {net_profit} profit")
                            # Execute the arbitrage
                            result = await self.execute_arbitrage(
                                path=opp['path'],
                                amount=simulation['optimal_amount'],
                                min_profit=net_profit * Decimal('0.95')
                            )
                            
                            if result['success']:
                                logger.info(
                                    f"Arbitrage successful! Profit: {result['profit']}"
                                )
                            else:
                                logger.error(
                                    f"Arbitrage failed: {result.get('error')}"
                                )

                await asyncio.sleep(1)  # Poll every second

            except Exception as e:
                logger.error(f"Error in opportunity monitor: {str(e)}")
                await asyncio.sleep(5)  # Back off on error

    async def _simulate_arbitrage(self, opportunity: Dict) -> Dict:
        """Simulate arbitrage execution to find optimal amounts"""
        pools = opportunity['pools']
        path = opportunity['path']
        
        # Use binary search to find optimal amount
        min_amount = Decimal('0.1')  # 0.1 token minimum
        max_amount = min(
            Decimal(str(pool['liquidity'])) * Decimal('0.3')  
            for pool in pools
        )  # Max 30% of pool liquidity
        
        best_profit = Decimal('0')
        optimal_amount = Decimal('0')
        
        while min_amount <= max_amount:
            amount = (min_amount + max_amount) / 2
            
            # Simulate each swap
            current_amount = amount
            for i, hop in enumerate(path):
                pool = pools[i]
                output = await self._simulate_swap(
                    pool=pool,
                    token_in=hop['token_in'],
                    token_out=hop['token_out'],
                    amount_in=current_amount
                )
                current_amount = output['amount_out']
            
            profit = current_amount - amount
            
            if profit > best_profit:
                best_profit = profit
                optimal_amount = amount
                if profit <= 0:
                    max_amount = amount - Decimal('0.1')
                else:
                    min_amount = amount + Decimal('0.1')
            else:
                max_amount = amount - Decimal('0.1')
                
        return {
            'optimal_amount': optimal_amount,
            'profit': best_profit
        }

    async def _estimate_gas_cost(self, opportunity: Dict) -> Decimal:
        """Estimate gas cost for arbitrage execution"""
        gas_price = await self.gas_optimizer.get_optimal_gas_price()
        
        # Estimate base cost for flash loan
        base_gas = 150000  # Base gas for flash loan
        
        # Add gas for each swap
        swap_gas = 100000  # Average gas per swap
        total_gas = base_gas + (len(opportunity['path']) * swap_gas)
        
        # Convert to ETH cost
        eth_cost = Decimal(str(total_gas * gas_price)) / Decimal('1e18')
        
        # Convert to USD
        eth_price = await self.price_feeds.get_eth_price()
        return eth_cost * eth_price

    def _parse_profit_from_receipt(self, receipt) -> Decimal:
        """Parse actual profit from transaction receipt"""
        for log in receipt.logs:
            try:
                event = self.arbitrage_contract.events.ArbitrageExecuted().process_log(log)
                return Decimal(str(event.args.profit)) / Decimal('1e18')
            except:
                continue
        return Decimal('0')