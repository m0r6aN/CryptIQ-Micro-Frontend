# File path: CryptIQ-Micro-Frontend/services/trading-service/smart_cross_asset_arbitrage_finder.py

import pandas as pd

"""
Smart Cross-Asset Arbitrage Finder
"""

class SmartCrossAssetArbitrageFinder:
    def __init__(self, arbitrage_threshold: float = 0.01):
        self.arbitrage_threshold = arbitrage_threshold

    def find_arbitrage_opportunities(self, asset_prices: pd.DataFrame):
        """
        Find cross-asset arbitrage opportunities.
        Args:
            asset_prices: DataFrame containing prices of multiple assets across exchanges.
        """
        asset_prices['price_diff'] = asset_prices.max(axis=1) - asset_prices.min(axis=1)
        opportunities = asset_prices[asset_prices['price_diff'] > self.arbitrage_threshold * asset_prices.mean(axis=1)]
        return opportunities

# Example usage
asset_prices = pd.DataFrame({
    'BTC_Binance': [10000, 10200, 10500, 10700, 10400],
    'BTC_Kraken': [10100, 10150, 10600, 10800, 10350],
    'ETH_Binance': [300, 310, 305, 315, 320],
    'ETH_Kraken': [310, 315, 300, 320, 325]
})
finder = SmartCrossAssetArbitrageFinder(arbitrage_threshold=0.02)
print("Arbitrage Opportunities:", finder.find_arbitrage_opportunities(asset_prices))
