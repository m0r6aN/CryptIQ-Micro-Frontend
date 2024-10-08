# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/token_unlock_tracker.py

import requests
import pandas as pd

"""
On-Chain Token Unlock Tracker
"""

class TokenUnlockTracker:
    def __init__(self, api_url: str):
        self.api_url = api_url

    def fetch_upcoming_unlocks(self):
        """
        Fetch upcoming token unlocks from the API.
        """
        response = requests.get(f"{self.api_url}/upcoming-unlocks")
        if response.status_code == 200:
            return pd.DataFrame(response.json()['data'])
        else:
            print("Error fetching token unlock data")
            return pd.DataFrame()

    def detect_large_unlocks(self, unlock_data: pd.DataFrame, threshold: float = 1000000):
        """
        Detect large unlock events above the specified threshold.
        """
        large_unlocks = unlock_data[unlock_data['unlock_amount'] > threshold]
        return large_unlocks

# Example usage
tracker = TokenUnlockTracker("https://api.tokenmetrics.com")
upcoming_unlocks = tracker.fetch_upcoming_unlocks()
print(tracker.detect_large_unlocks(upcoming_unlocks))
