# File path: CryptIQ-Micro-Frontend/services/trading-service/smart_order_execution_simulator.py

import pandas as pd
import matplotlib.pyplot as plt

"""
Smart Order Execution Simulator
"""

class SmartOrderExecutionSimulator:
    def __init__(self):
        pass

    def simulate_order_execution(self, price_levels: pd.DataFrame, order_size: float):
        """
        Simulate the impact of executing a large order across different price levels.
        Args:
            price_levels: DataFrame containing price levels and volumes.
            order_size: Size of the order to simulate.
        """
        cumulative_volume = price_levels['volume'].cumsum()
        price_impact_index = cumulative_volume.searchsorted(order_size)
        if price_impact_index < len(price_levels):
            impact_price = price_levels.iloc[price_impact_index]['price']
            return impact_price
        else:
            return "Insufficient liquidity"

    def plot_execution_path(self, price_levels: pd.DataFrame, order_size: float):
        """
        Plot the price impact path for the given order size.
        """
        cumulative_volume = price_levels['volume'].cumsum()
        prices = price_levels['price']
        plt.plot(cumulative_volume, prices, marker='o')
        plt.axvline(order_size, color='r', linestyle='--')
        plt.title(f"Order Execution Path for {order_size} Units")
        plt.xlabel('Cumulative Volume')
        plt.ylabel('Price')
        plt.show()

# Example usage
price_levels = pd.DataFrame({
    'price': [100, 105, 110, 115, 120],
    'volume': [500, 800, 1200, 1500, 1000]
})
simulator = SmartOrderExecutionSimulator()
print(f"Simulated Impact Price: {simulator.simulate_order_execution(price_levels, 1300)}")
simulator.plot_execution_path(price_levels, 1300)
