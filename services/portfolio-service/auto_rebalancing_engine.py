# File path: CryptIQ-Micro-Frontend/services/portfolio-service/auto_rebalancing_engine.py

import pandas as pd

"""
Automated Portfolio Rebalancing Engine
"""

class AutoRebalancingEngine:
    def __init__(self, portfolio: dict, target_allocations: dict, total_balance: float):
        self.portfolio = portfolio
        self.target_allocations = target_allocations
        self.total_balance = total_balance

    def calculate_current_allocations(self):
        """
        Calculate the current allocations of each asset in the portfolio.
        """
        allocations = {asset: (self.portfolio[asset] / self.total_balance) for asset in self.portfolio}
        return allocations

    def generate_rebalancing_orders(self):
        """
        Generate rebalancing orders based on target allocations.
        """
        current_allocations = self.calculate_current_allocations()
        orders = []

        for asset, target in self.target_allocations.items():
            current = current_allocations.get(asset, 0)
            if current < target:
                amount_to_buy = (target - current) * self.total_balance
                orders.append({"asset": asset, "action": "buy", "amount": amount_to_buy})
            elif current > target:
                amount_to_sell = (current - target) * self.total_balance
                orders.append({"asset": asset, "action": "sell", "amount": amount_to_sell})

        return orders

# Example usage
portfolio = {'BTC': 5000, 'ETH': 3000, 'USDT': 2000}
target_allocations = {'BTC': 0.5, 'ETH': 0.3, 'USDT': 0.2}
engine = AutoRebalancingEngine(portfolio, target_allocations, total_balance=10000)
print(engine.generate_rebalancing_orders())
