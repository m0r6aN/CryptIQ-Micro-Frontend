# File path: CryptIQ-Micro-Frontend/services/trading-service/dynamic_market_depth_analyzer.py

import pandas as pd

"""
Dynamic Market Depth Analyzer
"""

class DynamicMarketDepthAnalyzer:
    def __init__(self):
        pass

    def analyze_market_depth(self, order_book: pd.DataFrame):
        """
        Analyze the market depth for large orders and detect potential support/resistance levels.
        Args:
            order_book: DataFrame containing bid and ask price levels and corresponding volumes.
        """
        support_levels = order_book[order_book['type'] == 'bid'].sort_values(by='price', ascending=False)
        resistance_levels = order_book[order_book['type'] == 'ask'].sort_values(by='price', ascending=True)

        strong_support = support_levels[support_levels['volume'] > support_levels['volume'].mean() * 2]
        strong_resistance = resistance_levels[resistance_levels['volume'] > resistance_levels['volume'].mean() * 2]

        return {'support_levels': strong_support, 'resistance_levels': strong_resistance}

# Example usage
order_book = pd.DataFrame({
    'price': [100, 105, 110, 115, 120, 125, 130, 135, 140, 145],
    'volume': [500, 1000, 1500, 800, 1200, 900, 1600, 1100, 700, 1400],
    'type': ['bid', 'bid', 'ask', 'ask', 'bid', 'bid', 'ask', 'ask', 'bid', 'ask']
})
analyzer = DynamicMarketDepthAnalyzer()
levels = analyzer.analyze_market_depth(order_book)
print("Support Levels:", levels['support_levels'])
print("Resistance Levels:", levels['resistance_levels'])
