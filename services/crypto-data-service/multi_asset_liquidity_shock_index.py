# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/multi_asset_liquidity_shock_index.py

import pandas as pd

"""
Multi-Asset Liquidity Shock Index Calculator
"""

class MultiAssetLiquidityShockIndex:
    def __init__(self, shock_threshold: float = 0.15):
        self.shock_threshold = shock_threshold

    def calculate_liquidity_shock_index(self, liquidity_data: pd.DataFrame):
        """
        Calculate the liquidity shock index for multiple assets.
        Args:
            liquidity_data: DataFrame containing historical liquidity levels for assets.
        """
        liquidity_data['liquidity_change'] = liquidity_data['liquidity'].pct_change()
        liquidity_data['shock_index'] = liquidity_data['liquidity_change'].abs()
        shock_events = liquidity_data[liquidity_data['shock_index'] > self.shock_threshold]
        return shock_events

# Example usage
liquidity_data = pd.DataFrame({
    'asset': ['BTC', 'ETH', 'LTC', 'XRP'],
    'liquidity': [1000, 1200, 900, 1100, 1300, 800, 700]
})
calculator = MultiAssetLiquidityShockIndex(shock_threshold=0.2)
print("Liquidity Shock Events:", calculator.calculate_liquidity_shock_index(liquidity_data))
