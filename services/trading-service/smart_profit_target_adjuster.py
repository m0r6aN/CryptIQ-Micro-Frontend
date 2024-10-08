# File path: CryptIQ-Micro-Frontend/services/trading-service/smart_profit_target_adjuster.py

import pandas as pd

"""
Smart Profit Target Adjuster
"""

class SmartProfitTargetAdjuster:
    def __init__(self, profit_margin: float = 0.2):
        self.profit_margin = profit_margin

    def adjust_profit_target(self, data: pd.DataFrame, initial_profit_target: float):
        """
        Adjust profit target dynamically based on current market conditions.
        Args:
            data: DataFrame containing price data.
            initial_profit_target: Initial profit target.
        """
        average_price = data['close'].mean()
        adjusted_target = initial_profit_target * (1 + self.profit_margin * (average_price / initial_profit_target))
        return adjusted_target

# Example usage
data = pd.DataFrame({'close': [100, 105, 110, 108, 115, 120]})
adjuster = SmartProfitTargetAdjuster(profit_margin=0.15)
print(f"Adjusted Profit Target: {adjuster.adjust_profit_target(data, initial_profit_target=110)}")
