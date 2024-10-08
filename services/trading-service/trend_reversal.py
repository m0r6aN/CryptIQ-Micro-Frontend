# File path: CryptIQ-Micro-Frontend/services/trading-service/trend_reversal.py

import pandas as pd
import talib

"""
 Trend Reversal Detection Module
"""

def detect_trend_reversal(data: pd.DataFrame):
    """
    Detects potential trend reversals using candlestick patterns and technical indicators.
    Args:
        data: Historical OHLCV data.
    """
    patterns = {
        'hammer': talib.CDLHAMMER(data['open'], data['high'], data['low'], data['close']),
        'engulfing': talib.CDLENGULFING(data['open'], data['high'], data['low'], data['close']),
        'doji': talib.CDLDOJI(data['open'], data['high'], data['low'], data['close']),
    }

    detected_reversals = {pattern: patterns[pattern].iloc[-1] for pattern in patterns if patterns[pattern].iloc[-1] != 0}
    return detected_reversals

def detect_divergence(data: pd.DataFrame):
    """
    Detect bullish or bearish divergence between price and RSI.
    """
    rsi = talib.RSI(data['close'], timeperiod=14)
    price_change = data['close'].diff()
    rsi_change = rsi.diff()

    # Bullish Divergence: Price is making lower lows, RSI is making higher lows
    if price_change.iloc[-1] < 0 and rsi_change.iloc[-1] > 0:
        return 'Bullish Divergence'

    # Bearish Divergence: Price is making higher highs, RSI is making lower highs
    if price_change.iloc[-1] > 0 and rsi_change.iloc[-1] < 0:
        return 'Bearish Divergence'

    return None
