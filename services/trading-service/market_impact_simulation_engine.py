# File path: CryptIQ-Micro-Frontend/services/trading-service/market_impact_simulation_engine.py

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

"""
Market Impact Simulation Engine
"""

class MarketImpactSimulationEngine:
    def __init__(self, initial_price: float = 100.0):
        self.initial_price = initial_price

    def simulate_market_impact(self, volume: float, depth: pd.DataFrame, impact_coefficient: float = 0.2):
        """
        Simulate the impact of large order execution on market prices.
        Args:
            volume: Volume of the order to simulate.
            depth: DataFrame containing 'price' and 'volume' columns.
            impact_coefficient: Sensitivity of price to volume changes.
        """
        cumulative_volume = depth['volume'].cumsum()
        price_impact_index = cumulative_volume.searchsorted(volume)

        if price_impact_index < len(depth):
            final_price = self.initial_price + (depth.iloc[price_impact_index]['price'] - self.initial_price) * impact_coefficient
            return final_price
        else:
            return "Insufficient liquidity for this order"

    def plot_impact_simulation(self, volume_levels: list, depth: pd.DataFrame):
        """
        Plot the simulated price impact for different order sizes.
        Args:
            volume_levels: List of volumes to simulate.
            depth: DataFrame containing 'price' and 'volume' columns.
        """
        prices = [self.simulate_market_impact(volume, depth) for volume in volume_levels]
        plt.plot(volume_levels, prices)
        plt.xlabel('Order Volume')
        plt.ylabel('Simulated Final Price')
        plt.title('Market Impact Simulation')
        plt.show()

# Example usage
depth = pd.DataFrame({'price': [100, 102, 104, 106, 108], 'volume': [50, 100, 150, 200, 250]})
simulation_engine = MarketImpactSimulationEngine(initial_price=100)
simulation_engine.plot_impact_simulation([50, 100, 200, 300, 400], depth)
