# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/whale_transaction_heatmap_generator.py

import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

"""
Real-Time Whale Transaction Heatmap Generator
"""

class WhaleTransactionHeatmapGenerator:
    def __init__(self):
        pass

    def generate_heatmap(self, whale_transactions: pd.DataFrame):
        """
        Generate a heatmap for visualizing whale transactions across multiple price levels.
        Args:
            whale_transactions: DataFrame containing whale transaction data.
        """
        plt.figure(figsize=(10, 6))
        sns.heatmap(whale_transactions.pivot('price_level', 'transaction_volume'), annot=True, cmap='coolwarm')
        plt.title("Whale Transaction Heatmap")
        plt.show()

# Example usage
whale_transactions = pd.DataFrame({
    'price_level': [100, 105, 110, 115, 120],
    'transaction_volume': [5000, 3000, 4000, 2500, 3500]
})
heatmap_generator = WhaleTransactionHeatmapGenerator()
heatmap_generator.generate_heatmap(whale_transactions)
