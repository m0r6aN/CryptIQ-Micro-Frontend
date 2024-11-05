# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/liquidity_correlation_matrix.py

import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

"""
Multi-Asset Liquidity Correlation Matrix
"""

class LiquidityCorrelationMatrix:
    def __init__(self, liquidity_data: pd.DataFrame):
        self.liquidity_data = liquidity_data

    def calculate_correlation(self):
        """
        Calculate the correlation matrix for liquidity levels across multiple assets.
        """
        return self.liquidity_data.corr()

    def plot_correlation_heatmap(self, correlation_matrix: pd.DataFrame):
        """
        Plot a heatmap of the liquidity correlation matrix.
        """
        plt.figure(figsize=(10, 8))
        sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', linewidths=0.5)
        plt.title("Liquidity Correlation Heatmap")
        plt.show()

# Example usage
liquidity_data = pd.DataFrame({
    'BTC': [1000, 1200, 1100, 1050, 1300],
    'ETH': [500, 600, 550, 580, 620],
    'LTC': [200, 220, 210, 230, 240],
    'XRP': [300, 320, 310, 330, 340]
})
matrix = LiquidityCorrelationMatrix(liquidity_data)
correlation_matrix = matrix.calculate_correlation()
matrix.plot_correlation_heatmap(correlation_matrix)
