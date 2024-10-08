# File path: CryptIQ-Micro-Frontend/services/trading-service/dynamic_trend_reversal_detector.py

import pandas as pd

"""
Dynamic Trend Reversal Detector
"""

class DynamicTrendReversalDetector:
    def __init__(self, reversal_threshold: float = 0.03):
        self.reversal_threshold = reversal_threshold

    def detect_reversals(self, price_data: pd.DataFrame):
        """
        Detect trend reversals using percentage changes.
        Args:
            price_data: DataFrame containing historical price data.
        """
        price_data['price_change'] = price_data['price'].pct_change()
        reversals = price_data[price_data['price_change'].abs() > self.reversal_threshold]
        return reversals

# Example usage
price_data = pd.DataFrame({'price': [100, 105, 110, 115, 112, 108, 120, 130]})
detector = DynamicTrendReversalDetector(reversal_threshold=0.05)
print("Detected Reversals:", detector.detect_reversals(price_data))
