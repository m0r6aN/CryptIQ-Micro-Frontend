# File path: CryptIQ-Micro-Frontend/services/trading-service/multi_strategy_hedging_optimization.py

import pandas as pd
import numpy as np

"""
Multi-Strategy Hedging Optimization
"""

class MultiStrategyHedgingOptimization:
    def __init__(self, hedging_ratios: dict):
        self.hedging_ratios = hedging_ratios

    def optimize_hedging(self, asset_data: pd.DataFrame, market_conditions: str):
        """
        Optimize hedging strategy based on current market conditions.
        Args:
            asset_data: DataFrame containing asset price data.
            market_conditions: Current market condition ('bullish', 'bearish', 'neutral').
        """
        hedge_adjustments = asset_data.copy()
        if market_conditions == 'bearish':
            hedge_adjustments['hedging_position'] = asset_data['price'] * self.hedging_ratios['bearish']
        elif market_conditions == 'bullish':
            hedge_adjustments['hedging_position'] = asset_data['price'] * self.hedging_ratios['bullish']
        else:
            hedge_adjustments['hedging_position'] = asset_data['price'] * self.hedging_ratios['neutral']
        return hedge_adjustments

# Example usage
asset_data = pd.DataFrame({'price': [100, 105, 110, 115, 120]})
hedging_ratios = {'bullish': 0.2, 'bearish': 0.5, 'neutral': 0.3}
optimizer = MultiStrategyHedgingOptimization(hedging_ratios)
print(optimizer.optimize_hedging(asset_data, 'bearish'))
