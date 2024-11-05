# File path: CryptIQ-Micro-Frontend/services/trading-service/smart_order_flow_analyzer.py

import pandas as pd

"""
Smart Order Flow Analysis Tool
"""

class SmartOrderFlowAnalyzer:
    def __init__(self, volume_threshold: float = 0.05):
        self.volume_threshold = volume_threshold

    def analyze_order_flow(self, data: pd.DataFrame):
        """
        Analyze order flow by detecting large buy/sell orders that exceed the volume threshold.
        """
        data['order_flow'] = data['buy_volume'] - data['sell_volume']
        large_orders = data[abs(data['order_flow']) > self.volume_threshold]
        return large_orders

# Example usage
data = pd.DataFrame({
    'buy_volume': [500, 800, 1000, 700, 1200],
    'sell_volume': [300, 400, 1100, 600, 500]
})
analyzer = SmartOrderFlowAnalyzer(volume_threshold=200)
print(analyzer.analyze_order_flow(data))
