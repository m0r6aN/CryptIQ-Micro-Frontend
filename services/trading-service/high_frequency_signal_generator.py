# File path: CryptIQ-Micro-Frontend/services/trading-service/high_frequency_signal_generator.py

import pandas as pd

"""
High-Frequency Trade Signal Generator
"""

class HighFrequencySignalGenerator:
    def __init__(self, data: pd.DataFrame, signal_threshold: float = 0.01):
        self.data = data
        self.signal_threshold = signal_threshold

    def generate_signals(self):
        """
        Generate high-frequency trading signals based on small price fluctuations.
        """
        self.data['price_change'] = self.data['close'].pct_change()
        self.data['signal'] = self.data['price_change'].apply(self.evaluate_signal)
        return self.data

    def evaluate_signal(self, price_change):
        """
        Evaluate buy, sell, or hold signals based on price change percentage.
        """
        if price_change > self.signal_threshold:
            return 'buy'
        elif price_change < -self.signal_threshold:
            return 'sell'
        else:
            return 'hold'

# Example usage
data = pd.DataFrame({'close': [100, 100.5, 101, 100.8, 101.5, 102, 101.8]})
generator = HighFrequencySignalGenerator(data, signal_threshold=0.002)
print(generator.generate_signals())
