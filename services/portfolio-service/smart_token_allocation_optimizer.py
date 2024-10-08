# File path: CryptIQ-Micro-Frontend/services/portfolio-service/smart_token_allocation_optimizer.py

import pandas as pd

"""
Smart Token Allocation Optimizer
"""


class SmartTokenAllocationOptimizer:
    def __init__(self, allocation_weights: dict):
        self.allocation_weights = allocation_weights

    def optimize_allocation(self, portfolio: pd.DataFrame):
        """
        Optimize token allocations in the portfolio based on predefined allocation weights.
        Args:
            portfolio: DataFrame containing current portfolio values.
        """
        total_value = portfolio['value'].sum()
        portfolio['optimized_allocation'] = portfolio['token'].apply(lambda x: total_value * self.allocation_weights.get(x, 0))
        return portfolio

# Example usage
portfolio = pd.DataFrame({
    'token': ['BTC', 'ETH', 'LTC'],
    'value': [5000, 3000, 2000]
})
allocation_weights = {'BTC': 0.5, 'ETH': 0.3, 'LTC': 0.2}
optimizer = SmartTokenAllocationOptimizer(allocation_weights)
print(optimizer.optimize_allocation(portfolio))
