# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/defi_yield_optimizer.py

import requests
import pandas as pd

"""
DeFi Yield Optimizer
"""

class DeFiYieldOptimizer:
    def __init__(self, api_url: str):
        self.api_url = api_url

    def fetch_pool_data(self):
        """
        Fetch data for all DeFi yield pools.
        """
        response = requests.get(f"{self.api_url}/pools")
        if response.status_code == 200:
            return pd.DataFrame(response.json()['data'])
        else:
            print("Error fetching DeFi pool data")
            return pd.DataFrame()

    def optimize_yield(self, pool_data: pd.DataFrame, risk_level: str = 'medium'):
        """
        Optimize yield allocation based on risk level.
        Args:
            pool_data: DataFrame containing pool data.
            risk_level: 'low', 'medium', or 'high' risk tolerance.
        """
        if risk_level == 'low':
            optimal_pools = pool_data[pool_data['risk'] == 'low'].sort_values(by='apr', ascending=False)
        elif risk_level == 'medium':
            optimal_pools = pool_data[pool_data['risk'] != 'high'].sort_values(by='apr', ascending=False)
        else:
            optimal_pools = pool_data.sort_values(by='apr', ascending=False)
        return optimal_pools.head(5)  # Return top 5 pools

# Example usage
optimizer = DeFiYieldOptimizer("https://api.yieldprotocol.io")
pool_data = optimizer.fetch_pool_data()
print(optimizer.optimize_yield(pool_data, risk_level='high'))
