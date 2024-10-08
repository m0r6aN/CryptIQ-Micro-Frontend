# File path: CryptIQ-Micro-Frontend/services/trading-service/multi_factor_builder.py

import pandas as pd
import talib

"""
Multi-Factor Strategy Builder
"""

class MultiFactorStrategy:
    def __init__(self):
        self.indicators = []

    def add_indicator(self, indicator_name: str, indicator_function):
        """
        Adds a new indicator to the strategy.
        """
        self.indicators.append((indicator_name, indicator_function))

    def evaluate_strategy(self, data: pd.DataFrame):
        """
        Evaluate the strategy using all defined indicators.
        """
        signals = []
        for name, func in self.indicators:
            signals.append(func(data))
        return signals

# Indicator functions
def rsi_indicator(data):
    return talib.RSI(data['close'], timeperiod=14)

def macd_indicator(data):
    macd, macdsignal, _ = talib.MACD(data['close'], fastperiod=12, slowperiod=26, signalperiod=9)
    return macd - macdsignal

# Example usage
strategy = MultiFactorStrategy()
strategy.add_indicator("RSI", rsi_indicator)
strategy.add_indicator("MACD", macd_indicator)

data = pd.DataFrame({'close': [100, 102, 104, 103, 107, 110, 108]})
signals = strategy.evaluate_strategy(data)
print(f"Multi-Factor Strategy Signals: {signals}")
