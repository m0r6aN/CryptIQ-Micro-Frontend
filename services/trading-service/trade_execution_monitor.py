# File path: CryptIQ-Micro-Frontend/services/trading-service/trade_execution_monitor.py

import pandas as pd

"""
Real-Time Trade Execution Monitor
"""

class TradeExecutionMonitor:
    def __init__(self):
        self.trade_history = pd.DataFrame(columns=['trade_id', 'symbol', 'action', 'price', 'amount', 'status'])

    def record_trade(self, trade_id: str, symbol: str, action: str, price: float, amount: float, status: str):
        """
        Record a new trade in the trade history.
        """
        new_trade = pd.DataFrame([[trade_id, symbol, action, price, amount, status]], columns=self.trade_history.columns)
        self.trade_history = pd.concat([self.trade_history, new_trade], ignore_index=True)

    def update_trade_status(self, trade_id: str, status: str):
        """
        Update the status of an existing trade.
        """
        self.trade_history.loc[self.trade_history['trade_id'] == trade_id, 'status'] = status

    def get_open_trades(self):
        """
        Get a list of all currently open trades.
        """
        return self.trade_history[self.trade_history['status'] == 'open']

# Example usage
monitor = TradeExecutionMonitor()
monitor.record_trade('T001', 'BTC/USD', 'buy', 50000, 0.1, 'open')
monitor.update_trade_status('T001', 'completed')
print(monitor.get_open_trades())
