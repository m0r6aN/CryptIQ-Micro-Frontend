# File path: CryptIQ-Micro-Frontend/services/trading-service/price_volatility_spike_detector.py

import pandas as pd

"""
Price Volatility Spike Detector
"""

class PriceVolatilitySpikeDetector:
    def __init__(self, volatility_threshold: float = 0.02):
        self.volatility_threshold = volatility_threshold

    def detect_spikes(self, data: pd.DataFrame):
        """
        Detect price volatility spikes based on a rolling standard deviation.
        """
        data['volatility'] = data['close'].pct_change().rolling(10).std()
        spikes = data[data['volatility'] > self.volatility_threshold]
        return spikes

# Example usage
data = pd.DataFrame({'close': [100, 102, 101, 105, 110, 108, 112, 115, 118, 120]})
detector = PriceVolatilitySpikeDetector(volatility_threshold=0.03)
print(detector.detect_spikes(data))
