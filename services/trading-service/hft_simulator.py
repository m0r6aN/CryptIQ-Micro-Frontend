# File path: CryptIQ-Micro-Frontend/services/trading-service/hft_simulator.py

import pandas as pd

"""
High-Frequency Trading Simulator
"""

class HighFrequencyTradingSimulator:
    def __init__(self, data: pd.DataFrame):
        self.data = data
        self.orders = []

    def place_order(self, order_type: str, price: float, size: float):
        """
        Simulates placing a high-frequency trading order.
        """
        order = {'type': order_type, 'price': price, 'size': size}
        self.orders.append(order)
        print(f"Order placed: {order}")

    def run_simulation(self):
        """
        Runs a basic HFT simulation based on rapid price changes.
        """
        for i in range(1, len(self.data)):
            current_price = self.data['close'].iloc[i]
            previous_price = self.data['close'].iloc[i - 1]
            price_diff = current_price - previous_price

            # Buy if the price increased rapidly
            if price_diff > 0.5:
                self.place_order('buy', current_price, 0.1)
            # Sell if the price dropped rapidly
            elif price_diff < -0.5:
                self.place_order('sell', current_price, 0.1)

# Example usage
data = pd.DataFrame({"close": [100, 101, 102, 103, 105, 104, 103]})
simulator = HighFrequencyTradingSimulator(data)
simulator.run_simulation()
