# File path: CryptIQ-Micro-Frontend/services/portfolio-service/cross_asset_volatility_analyzer.py

import pandas as pd

"""
Cross-Asset Volatility Analyzer
"""

class CrossAssetVolatilityAnalyzer:
    def __init__(self, lookback_period: int = 20):
        self.lookback_period = lookback_period

    def calculate_volatility(self, price_data: pd.DataFrame):
        """
        Calculate rolling volatility for each asset in the portfolio.
        Args:
            price_data: DataFrame containing historical price data for assets.
        """
        volatilities = price_data.pct_change().rolling(self.lookback_period).std()
        return volatilities

    def compare_volatility(self, volatilities: pd.DataFrame):
        """
        Compare volatilities across assets to identify high-risk assets.
        Args:
            volatilities: DataFrame containing volatility data for each asset.
        """
        max_volatility = volatilities.max(axis=1)
        high_risk_assets = volatilities.idxmax(axis=1).loc[max_volatility > 0.05]  # Threshold: 5%
        return high_risk_assets

# Example usage
price_data = pd.DataFrame({
    'BTC': [50000, 51000, 50500, 52000, 53000],
    'ETH': [3000, 3050, 2900, 3100, 3150],
    'LTC': [200, 195, 205, 210, 220]
})
analyzer = CrossAssetVolatilityAnalyzer(lookback_period=2)
volatilities = analyzer.calculate_volatility(price_data)
print("High-Risk Assets:", analyzer.compare_volatility(volatilities))
