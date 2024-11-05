# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/smart_liquidity_pool_monitor.py

import requests
import pandas as pd

"""
Smart Liquidity Pool Monitor
"""

class SmartLiquidityPoolMonitor:
    def __init__(self, api_url: str, pool_ids: list):
        self.api_url = api_url
        self.pool_ids = pool_ids

    def fetch_pool_data(self):
        """
        Fetch liquidity pool data for the given pool IDs.
        """
        pool_data = []
        for pool_id in self.pool_ids:
            response = requests.get(f"{self.api_url}/pools/{pool_id}")
            if response.status_code == 200:
                pool_data.append(response.json())
            else:
                print(f"Error fetching data for pool ID: {pool_id}")

        return pd.DataFrame(pool_data)

    def detect_liquidity_anomalies(self, pool_data: pd.DataFrame, threshold: float = 0.1):
        """
        Detect sudden changes in liquidity levels in the pools.
        """
        pool_data['liquidity_change'] = pool_data['totalLiquidity'].pct_change()
        anomalies = pool_data[pool_data['liquidity_change'].abs() > threshold]
        return anomalies

# Example usage
monitor = SmartLiquidityPoolMonitor("https://api.defi.com", ["pool123", "pool456"])
pool_data = monitor.fetch_pool_data()
print(monitor.detect_liquidity_anomalies(pool_data))
