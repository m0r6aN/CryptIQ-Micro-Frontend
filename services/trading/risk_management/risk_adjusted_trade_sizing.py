# File path: CryptIQ-Micro-Frontend/services/trading-service/risk_adjusted_trade_sizing.py

import pandas as pd

"""
Risk-Adjusted Trade Sizing Engine
"""

class RiskAdjustedTradeSizing:
    def __init__(self, risk_percentage: float = 1.0):
        self.risk_percentage = risk_percentage

    def calculate_position_size(self, account_balance: float, stop_loss: float, entry_price: float):
        """
        Calculate the position size based on account balance, risk percentage, stop-loss, and entry price.
        Args:
            account_balance: Total balance of the trading account.
            stop_loss: Stop-loss price for the trade.
            entry_price: Entry price of the asset.
        """
        risk_amount = account_balance * (self.risk_percentage / 100)
        position_size = risk_amount / abs(entry_price - stop_loss)
        return position_size

# Example usage
sizing = RiskAdjustedTradeSizing(risk_percentage=2.0)
position_size = sizing.calculate_position_size(10000, 95, 105)
print(f"Position Size: {position_size} units")
