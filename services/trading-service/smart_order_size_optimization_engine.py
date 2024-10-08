# File path: CryptIQ-Micro-Frontend/services/trading-service/smart_order_size_optimization_engine.py

import pandas as pd

"""
Smart Order Size Optimization Engine
"""

class SmartOrderSizeOptimizationEngine:
    def __init__(self, max_impact: float = 0.1):
        self.max_impact = max_impact

    def optimize_order_size(self, liquidity_data: pd.DataFrame):
        """
        Optimize order size based on liquidity and market impact.
        Args:
            liquidity_data: DataFrame containing liquidity data.
        """
        liquidity_data['optimal_order_size'] = liquidity_data['liquidity'] * self.max_impact
        return liquidity_data

# Example usage
liquidity_data = pd.DataFrame({
    'price_level': [100, 105, 110, 115],
    'liquidity': [1000, 1200, 800, 1500]
})
engine = SmartOrderSizeOptimizationEngine(max_impact=0.05)
print("Optimized Order Sizes:", engine.optimize_order_size(liquidity_data))
