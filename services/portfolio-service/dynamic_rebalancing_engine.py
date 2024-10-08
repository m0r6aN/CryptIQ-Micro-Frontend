# File path: CryptIQ-Micro-Frontend/services/portfolio-service/dynamic_rebalancing_engine.py

import pandas as pd

class DynamicRebalancingEngine:
    def __init__(self, target_allocations: dict, rebalance_threshold: float = 0.05):
        self.target_allocations = target_allocations
        self.rebalance_threshold = rebalance_threshold

    def calculate_current_allocations(self, portfolio: pd.DataFrame):
        """
        Calculate current allocations based on portfolio values.
        """
        total_value = portfolio['value'].sum()
        portfolio['allocation'] = portfolio['value'] / total_value
        return portfolio

    def generate_rebalancing_orders(self, portfolio: pd.DataFrame):
        """
        Generate rebalancing orders if allocations deviate beyond the threshold.
        """
        portfolio = self.calculate_current_allocations(portfolio)
        orders = []

        for asset, target in self.target_allocations.items():
            current_allocation = portfolio.loc[portfolio['asset'] == asset, 'allocation'].values[0]
            if abs(current_allocation - target) > self.rebalance_threshold:
                rebalance_amount = (target - current_allocation) * portfolio['value'].sum()
                action = 'buy' if rebalance_amount > 0 else 'sell'
                orders.append({'asset': asset, 'action': action, 'amount': abs(rebalance_amount)})

        return orders

# Example usage
portfolio = pd.DataFrame({'asset': ['BTC', 'ETH', 'LTC'], 'value': [5000, 3000, 2000]})
target_allocations = {'BTC': 0.5, 'ETH': 0.3, 'LTC': 0.2}
engine = DynamicRebalancingEngine(target_allocations, rebalance_threshold=0.02)
print(engine.generate_rebalancing_orders(portfolio))
