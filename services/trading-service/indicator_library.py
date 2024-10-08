# File path: CryptIQ-Micro-Frontend/services/trading-service/indicator_library.py

import talib
import pandas as pd

# Indicator function registry
indicator_registry = {
    'RSI': lambda data: talib.RSI(data['close'], timeperiod=14),
    'MACD': lambda data: talib.MACD(data['close'], fastperiod=12, slowperiod=26, signalperiod=9),
    'BollingerBands': lambda data: talib.BBANDS(data['close'], timeperiod=20),
}

def calculate_indicator(data: pd.DataFrame, indicator_name: str):
    """
    Dynamically calculates the requested indicator.
    """
    indicator_function = indicator_registry.get(indicator_name)
    if indicator_function:
        return indicator_function(data)
    else:
        raise ValueError(f"Indicator {indicator_name} not found in the registry.")
