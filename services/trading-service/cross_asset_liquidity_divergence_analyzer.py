# File path: CryptIQ-Micro-Frontend/services/trading-service/cross_asset_liquidity_divergence_analyzer.py

import pandas as pd

"""
Cross-Asset Liquidity Divergence Analyzer
"""

class CrossAssetLiquidityDivergenceAnalyzer:
    def __init__(self, divergence_threshold: float = 0.05):
        self.divergence_threshold = divergence_threshold

    def analyze_liquidity_divergence(self, liquidity_data: pd.DataFrame):
        """
        Analyze liquidity divergence across multiple assets.
        Args:
            liquidity_data: DataFrame containing liquidity data for different assets.
        """
        liquidity_data['liquidity_spread'] = liquidity_data.max(axis=1) - liquidity_data.min(axis=1)
        divergences = liquidity_data[liquidity_data['liquidity_spread'] > self.divergence_threshold]
        return divergences

# Example usage
liquidity_data = pd.DataFrame({
    'BTC_liquidity': [5000, 3000, 4000, 2500, 3500],
    'ETH_liquidity': [2000, 2500, 2800, 1500, 2700],
    'LTC_liquidity': [1000, 1200, 900, 1800, 1100]
})
analyzer = CrossAssetLiquidityDivergenceAnalyzer(divergence_threshold=1000)
print("Liquidity Divergence Analysis:", analyzer.analyze_liquidity_divergence(liquidity_data))
