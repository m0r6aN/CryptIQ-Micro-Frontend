# File path: CryptIQ-Micro-Frontend/services/trading-service/dynamic_price_level_breakout_analyzer.py

import pandas as pd

"""
Dynamic Price Level Breakout Analyzer
"""

class DynamicPriceLevelBreakoutAnalyzer:
    def __init__(self, breakout_threshold: float = 0.05):
        self.breakout_threshold = breakout_threshold

    def detect_breakouts(self, price_data: pd.DataFrame):
        """
        Detect dynamic price level breakouts using percentage changes.
        Args:
            price_data: DataFrame containing historical price data.
        """
        price_data['price_change'] = price_data['price'].pct_change()
        breakouts = price_data[price_data['price_change'].abs() > self.breakout_threshold]
        return breakouts

# Example usage
price_data = pd.DataFrame({'price': [100, 105, 110, 115, 120, 130, 125, 140]})
analyzer = DynamicPriceLevelBreakoutAnalyzer(breakout_threshold=0.04)
print("Detected Breakouts:", analyzer.detect_breakouts(price_data))
