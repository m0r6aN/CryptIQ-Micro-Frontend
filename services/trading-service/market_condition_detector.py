# File path: CryptIQ-Micro-Frontend/services/trading-service/market_condition_detector.py

import talib
import pandas as pd

# Individual Indicator Functions
def calculate_rsi(data: pd.DataFrame) -> float:
    return talib.RSI(data['close'], timeperiod=14).iloc[-1]

def calculate_macd(data: pd.DataFrame) -> float:
    macd, macdsignal, macdhist = talib.MACD(data['close'], fastperiod=12, slowperiod=26, signalperiod=9)
    return macd.iloc[-1] - macdsignal.iloc[-1]

def calculate_bollinger_bands(data: pd.DataFrame):
    upperband, middleband, lowerband = talib.BBANDS(data['close'], timeperiod=20)
    return lowerband.iloc[-1], upperband.iloc[-1]

def detect_market_condition(data: pd.DataFrame) -> str:
    """
    Detects the market condition based on multiple independent indicators.
    Returns one of ['bullish', 'bearish', 'neutral'].
    """
    rsi = calculate_rsi(data)
    macd_signal = calculate_macd(data)
    lower_band, upper_band = calculate_bollinger_bands(data)

    # Rules to decide market condition
    if rsi > 70 and macd_signal > 0 and data['close'].iloc[-1] > upper_band:
        return 'bullish'
    elif rsi < 30 and macd_signal < 0 and data['close'].iloc[-1] < lower_band:
        return 'bearish'
    else:
        return 'neutral'
