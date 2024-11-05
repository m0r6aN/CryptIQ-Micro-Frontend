# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/smart_liquidity_pool_tracker.py

import requests
import pandas as pd

"""
Smart Liquidity Pool Tracker
"""

class SmartLiquidityPoolTracker:
    def __init__(self, api_url: str):
        self.api_url = api_url

    def fetch_liquidity_pools(self):
        """
        Fetch current liquidity pools from a DeFi protocol API.
        """
        response = requests.get(f"{self.api_url}/liquidity_pools")
        if response.status_code == 200:
            return pd.DataFrame(response.json()['data'])
        else:
            print("Error fetching liquidity pools")
            return pd.DataFrame()

    def track_pool_changes(self, pool_data: pd.DataFrame):
        """
        Track significant changes in liquidity pools over time.
        Args:
            pool_data: DataFrame containing liquidity pool data.
        """
        pool_data['liquidity_change'] = pool_data['liquidity'].pct_change()
        significant_changes = pool_data[pool_data['liquidity_change'].abs() > 0.1]  # 10% change threshold
        return significant_changes

# Example usage
tracker = SmartLiquidityPoolTracker("https://api.defipulse.com")
pool_data = tracker.fetch_liquidity_pools()
print("Significant Pool Changes:", tracker.track_pool_changes(pool_data))
