# File path: CryptIQ-Micro-Frontend/services/trading-service/smart_profit_loss_tracker.py

import pandas as pd

"""
Smart Profit and Loss Tracker
"""

class SmartProfitLossTracker:
    def __init__(self):
        self.trade_history = pd.DataFrame(columns=['trade_id', 'entry_price', 'exit_price', 'quantity', 'profit'])

    def record_trade(self, trade_id: str, entry_price: float, exit_price: float, quantity: float):
        """
        Record a trade and calculate the profit or loss.
        """
        profit = (exit_price - entry_price) * quantity
        new_trade = pd.DataFrame([[trade_id, entry_price, exit_price, quantity, profit]], columns=self.trade_history.columns)
        self.trade_history = pd.concat([self.trade_history, new_trade], ignore_index=True)

    def get_total_profit_loss(self):
        """
        Get the total profit or loss from all recorded trades.
        """
        return self.trade_history['profit'].sum()

# Example usage
tracker = SmartProfitLossTracker()
tracker.record_trade('T001', 50000, 52000, 0.1)
tracker.record_trade('T002', 3000, 3500, 1.0)
print("Total Profit/Loss:", tracker.get_total_profit_loss())
