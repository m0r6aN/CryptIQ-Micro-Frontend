# File path: CryptIQ-Micro-Frontend/services/ai_assistant/ai_based_market_correlation_matrix_generator.py

import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

"""
AI-Based Market Correlation Matrix Generator
"""

class AIMarketCorrelationMatrixGenerator:
    def __init__(self):
        pass

    def generate_correlation_matrix(self, price_data: pd.DataFrame):
        """
        Generate a market correlation matrix based on historical price data.
        Args:
            price_data: DataFrame containing historical price data for multiple assets.
        """
        correlation_matrix = price_data.corr()
        plt.figure(figsize=(12, 8))
        sns.heatmap(correlation_matrix, annot=True, cmap='viridis')
        plt.title("Market Correlation Matrix")
        plt.show()
        return correlation_matrix

# Example usage
price_data = pd.DataFrame({
    'BTC': [10000, 10200, 10500, 11000, 11500],
    'ETH': [300, 310, 320, 330, 340],
    'LTC': [50, 52, 54, 56, 58]
})
generator = AIMarketCorrelationMatrixGenerator()
print(generator.generate_correlation_matrix(price_data))
