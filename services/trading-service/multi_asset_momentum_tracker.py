# File path: CryptIQ-Micro-Frontend/services/trading-service/multi_asset_momentum_tracker.py

import pandas as pd

"""
 Multi-Asset Momentum Tracker
"""

class MultiAssetMomentumTracker:
    def __init__(self, momentum_threshold: float = 0.05):
        self.momentum_threshold = momentum_threshold

    def track_momentum(self, price_data: pd.DataFrame):
        """
        Track momentum across multiple assets.
        Args:
            price_data: DataFrame containing historical price data.
        """
        price_data['momentum'] = price_data['price'].pct_change()
        significant_momentum = price_data[price_data['momentum'].abs() > self.momentum_threshold]
        return significant_momentum

# Example usage
price_data = pd.DataFrame({'price': [100, 105, 110, 120, 125, 130, 140, 150]})
tracker = MultiAssetMomentumTracker(momentum_threshold=0.05)
print("Significant Momentum Changes:", tracker.track_momentum(price_data))
