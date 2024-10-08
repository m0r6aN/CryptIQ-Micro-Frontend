# File path: CryptIQ-Micro-Frontend/services/trading-service/dynamic_volatility_surface_generator.py

import pandas as pd
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

"""
Dynamic Volatility Surface Generator
"""

class DynamicVolatilitySurfaceGenerator:
    def __init__(self):
        pass

    def generate_volatility_surface(self, data: pd.DataFrame):
        """
        Generate a 3D volatility surface plot for options data.
        Args:
            data: DataFrame containing 'strike', 'expiry', and 'volatility' columns.
        """
        fig = plt.figure()
        ax = fig.add_subplot(111, projection='3d')
        x = data['strike']
        y = data['expiry']
        z = data['volatility']

        ax.scatter(x, y, z, c=z, cmap='viridis')
        ax.set_xlabel('Strike Price')
        ax.set_ylabel('Expiry (Days)')
        ax.set_zlabel('Volatility')
        plt.title("Dynamic Volatility Surface")
        plt.show()

# Example usage
data = pd.DataFrame({
    'strike': [100, 110, 120, 130, 140],
    'expiry': [30, 60, 90, 120, 150],
    'volatility': [0.15, 0.18, 0.2, 0.25, 0.3]
})
generator = DynamicVolatilitySurfaceGenerator()
generator.generate_volatility_surface(data)
