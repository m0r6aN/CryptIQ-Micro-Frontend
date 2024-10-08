# File path: CryptIQ-Micro-Frontend/services/trading-service/indicator_factory.py

import talib
import pandas as pd
from typing import Callable, Dict

class IndicatorFactory:
    def __init__(self):
        self.indicators: Dict[str, Callable] = {}

    def register_indicator(self, name: str, function: Callable):
        """
        Registers a new indicator.
        """
        self.indicators[name] = function

    def calculate(self, indicator_name: str, data: pd.DataFrame):
        """
        Calculate the specified indicator.
        """
        if indicator_name in self.indicators:
            return self.indicators[indicator_name](data)
        else:
            raise ValueError(f"Indicator '{indicator_name}' not found!")

# Initialize indicator factory
factory = IndicatorFactory()

# Register common indicators
factory.register_indicator('RSI', lambda data: talib.RSI(data['close'], timeperiod=14))
factory.register_indicator('EMA', lambda data: talib.EMA(data['close'], timeperiod=20))
