# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/liquidity_pool_analyzer.py

import requests
import pandas as pd

"""
Liquidity Pool Analyzer for DeFi Protocols
"""

class LiquidityPoolAnalyzer:
    def __init__(self, api_url: str, pool_id: str):
        self.api_url = api_url
        self.pool_id = pool_id

    def fetch_pool_data(self):
        """
        Fetch liquidity pool data from the API.
        """
        response = requests.get(f"{self.api_url}/pool/{self.pool_id}")
        if response.status_code == 200:
            return pd.DataFrame([response.json()])
        else:
            print(f"Error fetching pool data for {self.pool_id}")
            return pd.DataFrame()

    def analyze_liquidity(self, pool_data: pd.DataFrame):
        """
        Analyze liquidity and detect unusual changes in the pool's reserves.
        """
        pool_data['reserve_change'] = pool_data['totalReserves'].pct_change()
        significant_changes = pool_data[pool_data['reserve_change'].abs() > 0.1]
        return significant_changes

# Example usage
analyzer = LiquidityPoolAnalyzer("https://api.defiprotocol.com", "pool123")
pool_data = analyzer.fetch_pool_data()
print(analyzer.analyze_liquidity(pool_data))
