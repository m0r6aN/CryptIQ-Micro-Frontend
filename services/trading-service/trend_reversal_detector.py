# File path: CryptIQ-Micro-Frontend/services/trading-service/trend_reversal_detector.py

import pandas as pd
import talib

"""
Trend Reversal Detector
"""

class TrendReversalDetector:
    def __init__(self, data: pd.DataFrame):
        self.data = data

    def detect_reversal_patterns(self):
        """
        Detect common trend reversal patterns using TA-Lib.
        """
        self.data['hammer'] = talib.CDLHAMMER(self.data['open'], self.data['high'], self.data['low'], self.data['close'])
        self.data['engulfing'] = talib.CDLENGULFING(self.data['open'], self.data['high'], self.data['low'], self.data['close'])
        self.data['doji'] = talib.CDLDOJI(self.data['open'], self.data['high'], self.data['low'], self.data['close'])
        reversal_patterns = self.data[(self.data['hammer'] != 0) | (self.data['engulfing'] != 0) | (self.data['doji'] != 0)]
        return reversal_patterns

# Example usage
data = pd.DataFrame({
    'open': [100, 102, 104, 103, 107],
    'high': [102, 104, 105, 108, 110],
    'low': [98, 101, 102, 100, 105],
    'close': [101, 103, 104, 107, 108]
})
detector = TrendReversalDetector(data)
print(detector.detect_reversal_patterns())
