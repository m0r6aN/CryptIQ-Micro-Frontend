# File path: CryptIQ-Micro-Frontend/services/portfolio-service/cross_asset_correlation_analyzer.py

import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

"""
Advanced Cross-Asset Correlation Analyzer
"""

class CrossAssetCorrelationAnalyzer:
    def __init__(self, price_data: pd.DataFrame):
        self.price_data = price_data

    def calculate_correlation(self):
        """
        Calculate the correlation matrix for cross-asset price movements.
        """
        return self.price_data.corr()

    def plot_correlation_heatmap(self, correlation_matrix: pd.DataFrame):
        """
        Plot a heatmap of the correlation matrix.
        """
        plt.figure(figsize=(10, 8))
        sns.heatmap(correlation_matrix, annot=True, cmap='RdYlGn', linewidths=0.5)
        plt.title("Cross-Asset Correlation Heatmap")
        plt.show()

# Example usage
data = pd.DataFrame({
    'BTC': [100, 105, 102, 107, 109],
    'ETH': [50, 55, 52, 57, 59],
    'LTC': [20, 22, 21, 24, 26],
    'Gold': [1500, 1520, 1510, 1530, 1550],
    'SP500': [3000, 3050, 3020, 3070, 3090]
})
analyzer = CrossAssetCorrelationAnalyzer(data)
correlation_matrix = analyzer.calculate_correlation()
analyzer.plot_correlation_heatmap(correlation_matrix)
