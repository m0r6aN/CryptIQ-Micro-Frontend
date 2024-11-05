# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/smart_market_depth_analyzer.py

import pandas as pd

"""
Smart Market Depth Analyzer
"""

class SmartMarketDepthAnalyzer:
    def __init__(self, depth_threshold: float = 0.05):
        self.depth_threshold = depth_threshold

    def analyze_market_depth(self, order_book: pd.DataFrame):
        """
        Analyze the market depth to identify strong support and resistance levels.
        Args:
            order_book: DataFrame containing bid and ask levels.
        """
        order_book['depth'] = order_book['bids'] - order_book['asks']
        significant_depth = order_book[order_book['depth'].abs() > self.depth_threshold * order_book['depth'].max()]
        return significant_depth

# Example usage
order_book = pd.DataFrame({
    'price_level': [100, 105, 110, 115, 120],
    'bids': [1500, 2000, 1000, 1200, 800],
    'asks': [500, 600, 900, 1100, 700]
})
analyzer = SmartMarketDepthAnalyzer(depth_threshold=0.2)
print("Significant Depth Levels:", analyzer.analyze_market_depth(order_book))
