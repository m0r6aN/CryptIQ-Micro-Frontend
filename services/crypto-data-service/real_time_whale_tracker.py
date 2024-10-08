# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/real_time_whale_tracker.py

import pandas as pd
import requests

"""
Real-Time Whale Tracker
"""

class RealTimeWhaleTracker:
    def __init__(self, api_url: str):
        self.api_url = api_url

    def fetch_whale_transactions(self, min_value: float = 100000):
        """
        Fetch real-time whale transactions above the minimum value threshold.
        Args:
            min_value: Minimum transaction value to be considered a whale transaction.
        """
        response = requests.get(f"{self.api_url}/whale_transactions")
        if response.status_code == 200:
            data = pd.DataFrame(response.json()['transactions'])
            return data[data['value'] >= min_value]
        else:
            print("Error fetching whale transactions")
            return pd.DataFrame()

# Example usage
tracker = RealTimeWhaleTracker("https://api.whaletracker.com")
whale_transactions = tracker.fetch_whale_transactions(min_value=500000)
print(whale_transactions)
