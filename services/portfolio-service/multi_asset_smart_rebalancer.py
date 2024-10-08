# File path: CryptIQ-Micro-Frontend/services/portfolio-service/multi_asset_smart_rebalancer.py

import pandas as pd

"""
Multi-Asset Smart Rebalancing Engine
"""

class MultiAssetSmartRebalancer:
    def __init__(self, target_allocations: dict):
        self.target_allocations = target_allocations

    def rebalance(self, portfolio: pd.DataFrame):
        """
        Rebalance multi-asset portfolio based on target allocations.
        Args:
            portfolio: DataFrame containing current asset allocations and values.
        """
        total_value = portfolio['current_value'].sum()
        portfolio['target_value'] = portfolio['asset'].apply(lambda x: total_value * self.target_allocations.get(x, 0))
        portfolio['rebalance_amount'] = portfolio['target_value'] - portfolio['current_value']
        return portfolio

# Example usage
portfolio = pd.DataFrame({
    'asset': ['BTC', 'ETH', 'LTC'],
    'current_value': [5000, 3000, 2000]
})
target_allocations = {'BTC': 0.5, 'ETH': 0.3, 'LTC': 0.2}
rebalancer = MultiAssetSmartRebalancer(target_allocations)
print(rebalancer.rebalance(portfolio))
