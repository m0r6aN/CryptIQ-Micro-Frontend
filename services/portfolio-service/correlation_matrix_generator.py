# File path: CryptIQ-Micro-Frontend/services/portfolio-service/correlation_matrix_generator.py

import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

"""
Trading Correlation Matrix Generator
"""

class CorrelationMatrixGenerator:
    def __init__(self, price_data: pd.DataFrame):
        self.price_data = price_data

    def calculate_correlation_matrix(self):
        """
        Calculate the correlation matrix for the given price data.
        """
        return self.price_data.corr()

    def plot_correlation_matrix(self, correlation_matrix: pd.DataFrame):
        """
        Plot the correlation matrix using seaborn heatmap.
        """
        sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm')
        plt.show()

# Example usage
data = pd.DataFrame({
    'BTC': [100, 105, 102, 107, 109],
    'ETH': [50, 55, 52, 57, 59],
    'LTC': [20, 22, 21, 24, 26]
})
generator = CorrelationMatrixGenerator(data)
correlation_matrix = generator.calculate_correlation_matrix()
generator.plot_correlation_matrix(correlation_matrix)
