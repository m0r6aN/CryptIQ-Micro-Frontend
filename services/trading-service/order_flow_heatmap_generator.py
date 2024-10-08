# File path: CryptIQ-Micro-Frontend/services/trading-service/order_flow_heatmap_generator.py

import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

"""
 Real-Time Order Flow Heatmap Generator
"""

class OrderFlowHeatmapGenerator:
    def __init__(self):
        pass

    def generate_heatmap(self, order_data: pd.DataFrame):
        """
        Generate a heatmap for visualizing order flow across multiple price levels.
        Args:
            order_data: DataFrame containing order price levels and volume.
        """
        plt.figure(figsize=(10, 6))
        sns.heatmap(order_data.pivot('price_level', 'order_size'), annot=True, cmap='YlGnBu')
        plt.title("Order Flow Heatmap")
        plt.show()

# Example usage
order_data = pd.DataFrame({
    'price_level': [100, 105, 110, 115, 120],
    'order_size': [500, 800, 1200, 1500, 1000]
})
heatmap_generator = OrderFlowHeatmapGenerator()
heatmap_generator.generate_heatmap(order_data)
