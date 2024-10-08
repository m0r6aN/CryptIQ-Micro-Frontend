# File path: CryptIQ-Micro-Frontend/services/trading-service/smart_entry_exit_signal_generator.py

import pandas as pd

"""
Smart Entry and Exit Signal Generator
"""

class SmartEntryExitSignalGenerator:
    def __init__(self, rsi_threshold: float = 30.0, macd_threshold: float = 0.0):
        self.rsi_threshold = rsi_threshold
        self.macd_threshold = macd_threshold

    def generate_signals(self, data: pd.DataFrame):
        """
        Generate entry and exit signals using RSI and MACD.
        """
        data['entry_signal'] = (data['rsi'] < self.rsi_threshold) & (data['macd'] > self.macd_threshold)
        data['exit_signal'] = (data['rsi'] > 100 - self.rsi_threshold) & (data['macd'] < -self.macd_threshold)
        return data

# Example usage
data = pd.DataFrame({
    'rsi': [25, 35, 45, 55, 65, 75],
    'macd': [0.1, -0.05, 0.2, -0.1, 0.05, -0.2]
})
generator = SmartEntryExitSignalGenerator(rsi_threshold=30)
print(generator.generate_signals(data))
