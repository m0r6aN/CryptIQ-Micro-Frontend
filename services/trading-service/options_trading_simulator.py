# File path: CryptIQ-Micro-Frontend/services/trading-service/options_trading_simulator.py

import pandas as pd

"""
Options Trading Simulator
"""

class OptionsTradingSimulator:
    def __init__(self, underlying_price: float, strike_price: float, premium: float, option_type: str):
        self.underlying_price = underlying_price
        self.strike_price = strike_price
        self.premium = premium
        self.option_type = option_type

    def calculate_payout(self):
        """
        Calculate the payout based on the option type (call or put).
        """
        if self.option_type == 'call':
            return max(0, self.underlying_price - self.strike_price) - self.premium
        elif self.option_type == 'put':
            return max(0, self.strike_price - self.underlying_price) - self.premium
        else:
            raise ValueError("Invalid option type")

    def run_simulation(self, price_movements: pd.Series):
        """
        Simulates the payout over a range of underlying price movements.
        """
        payouts = price_movements.apply(lambda price: self.calculate_payout(price))
        return payouts

# Example usage
simulator = OptionsTradingSimulator(underlying_price=100, strike_price=110, premium=5, option_type='call')
price_movements = pd.Series([90, 95, 100, 105, 110, 115, 120])
print(simulator.run_simulation(price_movements))
