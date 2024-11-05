# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/volatility_analysis.py

import pandas as pd
import numpy as np

"""
Advanced Volatility Analysis Engine
"""

def calculate_atr(data: pd.DataFrame, period: int = 14) -> pd.Series:
    """
    Calculate the Average True Range (ATR) for volatility measurement.
    Args:
        data: DataFrame containing 'high', 'low', and 'close' columns.
        period: Time period for ATR calculation.
    """
    high_low = data['high'] - data['low']
    high_close = np.abs(data['high'] - data['close'].shift())
    low_close = np.abs(data['low'] - data['close'].shift())

    true_range = pd.concat([high_low, high_close, low_close], axis=1).max(axis=1)
    atr = true_range.rolling(period).mean()
    return atr

def calculate_bollinger_bands(data: pd.DataFrame, period: int = 20, num_std: float = 2.0):
    """
    Calculate Bollinger Bands for a given period and number of standard deviations.
    """
    rolling_mean = data['close'].rolling(period).mean()
    rolling_std = data['close'].rolling(period).std()
    upper_band = rolling_mean + (rolling_std * num_std)
    lower_band = rolling_mean - (rolling_std * num_std)

    return upper_band, lower_band

def detect_volatility_spike(data: pd.DataFrame, period: int = 14, threshold: float = 1.5):
    """
    Detects volatility spikes using ATR and a specified threshold.
    """
    atr = calculate_atr(data, period)
    volatility_spike = (atr > atr.mean() * threshold)
    return volatility_spike
