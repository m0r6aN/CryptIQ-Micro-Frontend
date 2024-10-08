# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/whale_transaction_impact_estimator.py

import pandas as pd

"""
Whale Transaction Impact Estimator
"""

class WhaleTransactionImpactEstimator:
    def __init__(self, market_depth: pd.DataFrame):
        self.market_depth = market_depth

    def estimate_price_impact(self, transaction_volume: float):
        """
        Estimate the price impact of a large transaction based on current market depth.
        Args:
            transaction_volume: Volume of the transaction to estimate impact for.
        """
        cumulative_volume = self.market_depth['volume'].cumsum()
        price_impact_index = cumulative_volume.searchsorted(transaction_volume)
        
        if price_impact_index < len(self.market_depth):
            return self.market_depth.iloc[price_impact_index]['price']
        else:
            return "Insufficient liquidity for this transaction volume."

# Example usage
market_depth = pd.DataFrame({'price': [100, 101, 102, 103, 104], 'volume': [50, 100, 150, 200, 250]})
estimator = WhaleTransactionImpactEstimator(market_depth)
print(f"Estimated Price Impact: {estimator.estimate_price_impact(175)}")
