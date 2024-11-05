# File path: CryptIQ-Micro-Frontend/services/trading-service/advanced_strategy_backtester.py

import pandas as pd

"""
Advanced Trading Strategy Backtester
"""

class AdvancedStrategyBacktester:
    def __init__(self, data: pd.DataFrame):
        self.data = data
        self.trades = []

    def backtest_strategy(self, strategy_function):
        """
        Backtest the given trading strategy on the provided data.
        """
        for i in range(1, len(self.data)):
            signal = strategy_function(self.data.iloc[:i])
            if signal == 'buy' and not self.has_open_position():
                self.open_trade(i, 'buy')
            elif signal == 'sell' and self.has_open_position():
                self.close_trade(i, 'sell')

        return self.calculate_performance()

    def has_open_position(self):
        """
        Check if there's an open position.
        """
        return len(self.trades) > 0 and self.trades[-1]['status'] == 'open'

    def open_trade(self, index, action):
        """
        Open a new trade.
        """
        self.trades.append({'entry_index': index, 'entry_price': self.data['close'].iloc[index], 'action': action, 'status': 'open'})

    def close_trade(self, index, action):
        """
        Close an existing trade.
        """
        if self.has_open_position():
            self.trades[-1]['exit_index'] = index
            self.trades[-1]['exit_price'] = self.data['close'].iloc[index]
            self.trades[-1]['status'] = 'closed'

    def calculate_performance(self):
        """
        Calculate the overall performance of the strategy.
        """
        profit = 0
        for trade in self.trades:
            if trade['status'] == 'closed':
                trade_profit = trade['exit_price'] - trade['entry_price'] if trade['action'] == 'buy' else trade['entry_price'] - trade['exit_price']
                profit += trade_profit
        return profit

# Example usage
data = pd.DataFrame({'close': [100, 102, 105, 103, 107, 110, 108]})

# Dummy strategy: Buy if price increases, Sell if price decreases
def dummy_strategy(data):
    if data['close'].iloc[-1] > data['close'].iloc[-2]:
        return 'buy'
    else:
        return 'sell'

backtester = AdvancedStrategyBacktester(data)
print(f"Strategy Performance: {backtester.backtest_strategy(dummy_strategy)}")
