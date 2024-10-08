# File path: CryptIQ-Micro-Frontend/services/portfolio-service/dynamic_cross_asset_regime_sensitivity_engine.py

import pandas as pd

"""
Dynamic Cross-Asset Regime Sensitivity Engine
"""

class DynamicCrossAssetRegimeSensitivityEngine:
    def __init__(self):
        pass

    def calculate_sensitivity(self, asset_data: pd.DataFrame, regime_factor: float = 0.5):
        """
        Calculate cross-asset regime sensitivity based on historical asset data.
        Args:
            asset_data: DataFrame containing historical asset values.
            regime_factor: Sensitivity factor to determine impact of regime changes.
        """
        asset_data['regime_sensitivity'] = asset_data['value'].pct_change() * regime_factor
        return asset_data

# Example usage
asset_data = pd.DataFrame({'asset': ['BTC', 'ETH', 'LTC'], 'value': [10000, 5000, 3000, 7000, 8500]})
engine = DynamicCrossAssetRegimeSensitivityEngine()
print("Regime Sensitivity Analysis:", engine.calculate_sensitivity(asset_data, regime_factor=0.3))
