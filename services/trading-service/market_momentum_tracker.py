# File path: CryptIQ-Micro-Frontend/services/trading-service/market_momentum_tracker.py

import pandas as pd

"""
Market Momentum Tracker
"""

class MarketMomentumTracker:
    def __init__(self, momentum_threshold: float = 0.05):
        self.momentum_threshold = momentum_threshold

    def calculate_momentum(self, data: pd.DataFrame):
        """
        Calculate momentum based on cumulative returns.
        """
        data['momentum'] = data['close'].pct_change().cumsum()
        strong_momentum = data[data['momentum'].abs() > self.momentum_threshold]
        return strong_momentum

# Example usage
data = pd.DataFrame({'close': [100, 105, 102, 110, 115, 108, 112, 115, 118, 120]})
tracker = MarketMomentumTracker(momentum_threshold=0.10)
print(tracker.calculate_momentum(data))
