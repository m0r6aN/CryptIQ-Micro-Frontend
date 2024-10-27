# File path: CryptIQ-Micro-Frontend/services/trading-service/real_time_volatility_breakout_detector.py

import pandas as pd
import numpy as np

class RealTimeVolatilityBreakoutDetector:
    def __init__(self, breakout_threshold: float = 0.05):
        self.breakout_threshold = breakout_threshold

    def detect_breakouts(self, data: pd.DataFrame):
        """
        Detect real-time volatility breakouts using Bollinger Bands.
        Args:
            data: DataFrame containing market price data.
        """
        data['rolling_mean'] = data['price'].rolling(20).mean()
        data['rolling_std'] = data['price'].rolling(20).std()
        data['upper_band'] = data['rolling_mean'] + 2 * data['rolling_std']
        data['lower_band'] = data['rolling_mean'] - 2 * data['rolling_std']

        breakouts = data[(data['price'] > data['upper_band']) | (data['price'] < data['lower_band'])]
        return breakouts

# Example usage
data = pd.DataFrame({'price': [100, 105, 110, 120, 130, 115, 112, 90, 85, 150, 160, 170]})
detector = RealTimeVolatilityBreakoutDetector(breakout_threshold=0.03)
print("Volatility Breakouts:", detector.detect_breakouts(data))
