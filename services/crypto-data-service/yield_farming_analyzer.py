# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/yield_farming_analyzer.py

import pandas as pd

"""
Yield Farming Strategy Analyzer
"""

class YieldFarmingAnalyzer:
    def __init__(self, pool_data: pd.DataFrame):
        self.pool_data = pool_data

    def calculate_apr(self):
        """
        Calculate the Annual Percentage Rate (APR) for each pool.
        """
        self.pool_data['apr'] = (self.pool_data['daily_yield'] * 365) / self.pool_data['staked_amount'] * 100
        return self.pool_data

    def recommend_top_pools(self, min_apr: float = 10.0):
        """
        Recommend top-performing yield farming pools based on APR.
        """
        top_pools = self.pool_data[self.pool_data['apr'] > min_apr]
        return top_pools.sort_values(by='apr', ascending=False)

# Example usage
pool_data = pd.DataFrame({
    'pool_name': ['Pool1', 'Pool2', 'Pool3'],
    'daily_yield': [50, 75, 60],
    'staked_amount': [1000, 2000, 1500]
})
analyzer = YieldFarmingAnalyzer(pool_data)
analyzer.calculate_apr()
print(analyzer.recommend_top_pools(12.0))
