# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/cross_asset_liquidity_impact_model.py

import pandas as pd

"""
 Cross-Asset Liquidity Impact Model
"""

class CrossAssetLiquidityImpactModel:
    def __init__(self, impact_factor: float = 0.05):
        self.impact_factor = impact_factor

    def model_impact(self, liquidity_data: pd.DataFrame, order_size: float):
        """
        Model liquidity impact for a given order size.
        Args:
            liquidity_data: DataFrame containing liquidity data for multiple assets.
            order_size: Size of the order to model.
        """
        liquidity_data['impact'] = liquidity_data['liquidity'] * self.impact_factor
        liquidity_data['order_impact'] = order_size / liquidity_data['impact']
        return liquidity_data

# Example usage
liquidity_data = pd.DataFrame({
    'asset': ['BTC', 'ETH', 'LTC'],
    'liquidity': [5000, 3000, 1000]
})
model = CrossAssetLiquidityImpactModel(impact_factor=0.05)
print("Liquidity Impact Model:", model.model_impact(liquidity_data, order_size=200))
