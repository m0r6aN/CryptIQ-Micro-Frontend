# File path: CryptIQ-Micro-Frontend/services/trading-service/market_manipulation_detector.py

import pandas as pd

"""
Market Manipulation Detector
"""

class MarketManipulationDetector:
    def __init__(self, threshold: float = 5.0):
        self.threshold = threshold

    def detect_spoofing(self, data: pd.DataFrame):
        """
        Detects potential spoofing by looking for large buy/sell order imbalances.
        """
        data['order_imbalance'] = data['buy_volume'] - data['sell_volume']
        spoofing_signals = data[data['order_imbalance'].abs() > self.threshold]
        return spoofing_signals

    def detect_pump_and_dump(self, data: pd.DataFrame):
        """
        Detects pump-and-dump patterns using rapid price changes.
        """
        data['price_change'] = data['close'].pct_change()
        pump_and_dump = data[(data['price_change'] > 0.2) & (data['price_change'].shift(-1) < -0.2)]
        return pump_and_dump

# Example usage
data = pd.DataFrame({
    'buy_volume': [500, 1000, 800, 1500, 700],
    'sell_volume': [300, 400, 1200, 1300, 100],
    'close': [100, 110, 115, 90, 95]
})
detector = MarketManipulationDetector()
print(detector.detect_spoofing(data))
print(detector.detect_pump_and_dump(data))
