# File path: CryptIQ-Micro-Frontend/services/trading-service/pattern_recognition.py

import pandas as pd
import talib

"""
Pattern Recognition Engine
"""

def detect_candlestick_patterns(data: pd.DataFrame):
    """
    Detects common candlestick patterns in OHLCV data.
    Args:
        data: DataFrame with 'open', 'high', 'low', 'close' columns.
    """
    patterns = {
        "Doji": talib.CDLDOJI(data['open'], data['high'], data['low'], data['close']),
        "Hammer": talib.CDLHAMMER(data['open'], data['high'], data['low'], data['close']),
        "Engulfing": talib.CDLENGULFING(data['open'], data['high'], data['low'], data['close']),
    }

    detected_patterns = {pattern: values[values != 0] for pattern, values in patterns.items()}
    return detected_patterns

# Example usage
data = pd.DataFrame({
    'open': [100, 102, 104, 103, 107],
    'high': [102, 104, 105, 108, 110],
    'low': [98, 101, 102, 100, 105],
    'close': [101, 103, 104, 107, 108]
})
patterns = detect_candlestick_patterns(data)
print(f"Detected Patterns: {patterns}")
