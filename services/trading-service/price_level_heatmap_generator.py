# File path: CryptIQ-Micro-Frontend/services/trading-service/price_level_heatmap_generator.py

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

"""
 Price Level Heatmap Generator
"""

class PriceLevelHeatmapGenerator:
    def __init__(self):
        pass

    def generate_heatmap(self, price_data: pd.DataFrame, volume_data: pd.DataFrame):
        """
        Generate a heatmap of price levels and trading volumes.
        Args:
            price_data: DataFrame containing historical price levels.
            volume_data: DataFrame containing corresponding trading volumes.
        """
        heatmap_data = pd.DataFrame({
            'Price Levels': price_data['close'],
            'Volume': volume_data['volume']
        })

        plt.figure(figsize=(10, 6))
        sns.heatmap(heatmap_data.pivot("Price Levels", "Volume"), annot=True, cmap='Blues')
        plt.title("Price Level Heatmap")
        plt.show()

# Example usage
price_data = pd.DataFrame({'close': [100, 105, 110, 115, 120, 125, 130]})
volume_data = pd.DataFrame({'volume': [1000, 1500, 2000, 1800, 2500, 3000, 2700]})
heatmap_generator = PriceLevelHeatmapGenerator()
heatmap_generator.generate_heatmap(price_data, volume_data)
