# File path: CryptIQ-Micro-Frontend/services/trading-service/market_impact_position_sizing_calculator.py

import pandas as pd

"""
 Market Impact Position Sizing Calculator
"""

class MarketImpactPositionSizingCalculator:
    def __init__(self, impact_factor: float = 0.1):
        self.impact_factor = impact_factor

    def calculate_position_size(self, liquidity_data: pd.DataFrame, target_impact: float):
        """
        Calculate optimal position size based on market impact.
        Args:
            liquidity_data: DataFrame containing liquidity data.
            target_impact: Target market impact to optimize for.
        """
        liquidity_data['impact'] = liquidity_data['liquidity'] * self.impact_factor
        optimal_position = liquidity_data[liquidity_data['impact'] >= target_impact]
        return optimal_position

# Example usage
liquidity_data = pd.DataFrame({
    'price_level': [100, 105, 110, 115, 120],
    'liquidity': [500, 800, 1200, 900, 600]
})
calculator = MarketImpactPositionSizingCalculator(impact_factor=0.05)
print("Optimal Position Size:", calculator.calculate_position_size(liquidity_data, target_impact=40))
