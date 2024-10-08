# File path: CryptIQ-Micro-Frontend/services/portfolio-service/multi_asset_regime_sensitivity_tracker.py

import pandas as pd

"""
Multi-Asset Regime Sensitivity Tracker
"""

class MultiAssetRegimeSensitivityTracker:
    def __init__(self):
        pass

    def track_sensitivity(self, asset_data: pd.DataFrame, sensitivity_threshold: float = 0.02):
        """
        Track sensitivity of assets to market regime shifts.
        Args:
            asset_data: DataFrame containing asset values over time.
            sensitivity_threshold: Sensitivity threshold to detect significant changes.
        """
        asset_data['sensitivity'] = asset_data['value'].pct_change()
        significant_sensitivity = asset_data[asset_data['sensitivity'].abs() > sensitivity_threshold]
        return significant_sensitivity

# Example usage
asset_data = pd.DataFrame({'value': [100, 105, 110, 95, 115, 130, 125, 140]})
tracker = MultiAssetRegimeSensitivityTracker()
print("Regime Sensitivity Results:", tracker.track_sensitivity(asset_data, sensitivity_threshold=0.05))
