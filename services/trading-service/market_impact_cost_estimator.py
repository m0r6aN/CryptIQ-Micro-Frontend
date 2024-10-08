# File path: CryptIQ-Micro-Frontend/services/trading-service/market_impact_cost_estimator.py

import pandas as pd

"""
Market Impact Cost Estimator
"""

class MarketImpactCostEstimator:
    def __init__(self, impact_coefficient: float = 0.1):
        self.impact_coefficient = impact_coefficient

    def estimate_impact_cost(self, volume: float, market_depth: pd.DataFrame):
        """
        Estimate market impact cost based on order volume and market depth.
        Args:
            volume: Volume of the order to execute.
            market_depth: DataFrame containing 'price' and 'volume' columns.
        """
        cumulative_volume = market_depth['volume'].cumsum()
        price_impact_index = cumulative_volume.searchsorted(volume)
        
        if price_impact_index < len(market_depth):
            impact_price = market_depth.iloc[price_impact_index]['price']
            impact_cost = (impact_price - market_depth['price'].iloc[0]) * self.impact_coefficient
            return impact_cost
        else:
            return "Insufficient liquidity for this volume"

# Example usage
market_depth = pd.DataFrame({'price': [100, 102, 104, 105, 107], 'volume': [50, 100, 150, 200, 250]})
estimator = MarketImpactCostEstimator(impact_coefficient=0.05)
print(f"Estimated Market Impact Cost: {estimator.estimate_impact_cost(175, market_depth)}")
