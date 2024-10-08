# File path: CryptIQ-Micro-Frontend/services/trading-service/cross_market_arbitrage_spread_analyzer.py

import pandas as pd

"""
Cross-Market Arbitrage Spread Analyzer
"""

class CrossMarketArbitrageSpreadAnalyzer:
    def __init__(self, spread_threshold: float = 0.01):
        self.spread_threshold = spread_threshold

    def analyze_arbitrage_spreads(self, market_data: pd.DataFrame):
        """
        Analyze arbitrage spreads across different markets.
        Args:
            market_data: DataFrame containing price data from multiple markets.
        """
        market_data['spread'] = market_data.max(axis=1) - market_data.min(axis=1)
        arbitrage_opportunities = market_data[market_data['spread'] > self.spread_threshold]
        return arbitrage_opportunities

# Example usage
market_data = pd.DataFrame({
    'BTC_US': [10000, 10200, 10500, 10800],
    'BTC_EU': [10100, 10300, 10600, 10900],
    'BTC_ASIA': [10050, 10250, 10450, 10750]
})
analyzer = CrossMarketArbitrageSpreadAnalyzer(spread_threshold=200)
print("Arbitrage Opportunities:", analyzer.analyze_arbitrage_spreads(market_data))
