# File path: CryptIQ-Micro-Frontend/services/trading-service/transaction_fee_optimizer.py

from web3 import Web3

"""
Transaction Fee Optimizer for On-Chain Trades
"""

class TransactionFeeOptimizer:
    def __init__(self, provider_url: str):
        self.w3 = Web3(Web3.HTTPProvider(provider_url))

    def optimize_gas_price(self):
        """
        Recommend an optimal gas price based on current network conditions.
        """
        latest_block = self.w3.eth.getBlock('latest')
        gas_prices = [tx['gasPrice'] for tx in self.w3.eth.getBlock(latest_block['number'] - 1)['transactions']]
        optimal_gas_price = min(gas_prices) + (max(gas_prices) - min(gas_prices)) * 0.25
        return self.w3.fromWei(optimal_gas_price, 'gwei')

    def estimate_transaction_cost(self, gas_limit: int, gas_price_gwei: float):
        """
        Estimate the total cost of a transaction based on gas limit and gas price.
        """
        gas_price_wei = self.w3.toWei(gas_price_gwei, 'gwei')
        return gas_limit * gas_price_wei / 1e18  # Return cost in ETH

# Example usage
optimizer = TransactionFeeOptimizer("https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID")
print(f"Optimal Gas Price: {optimizer.optimize_gas_price()} Gwei")
print(f"Estimated Transaction Cost: {optimizer.estimate_transaction_cost(21000, 50)} ETH")
