# File path: CryptIQ-Micro-Frontend/services/trading-service/smart_stop_loss_adjuster.py

import pandas as pd

"""
Smart Stop-Loss and Take-Profit Adjuster
"""

class SmartStopLossAdjuster:
    def __init__(self, trailing_stop_percentage: float = 0.05):
        self.trailing_stop_percentage = trailing_stop_percentage

    def adjust_stop_loss(self, data: pd.DataFrame, initial_stop_loss: float):
        """
        Adjust the stop-loss dynamically based on price movements.
        Args:
            data: DataFrame containing price data.
            initial_stop_loss: Initial stop-loss level.
        """
        highest_price = data['close'].max()
        trailing_stop_loss = highest_price * (1 - self.trailing_stop_percentage)
        return max(initial_stop_loss, trailing_stop_loss)

# Example usage
data = pd.DataFrame({'close': [100, 105, 102, 110, 115, 108]})
adjuster = SmartStopLossAdjuster(trailing_stop_percentage=0.05)
print(f"Adjusted Stop-Loss: {adjuster.adjust_stop_loss(data, initial_stop_loss=95)}")
