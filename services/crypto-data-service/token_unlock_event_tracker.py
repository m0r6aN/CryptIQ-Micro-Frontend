# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/token_unlock_event_tracker.py

import pandas as pd
import requests

"""
Token Unlock Event Tracker
"""

class TokenUnlockEventTracker:
    def __init__(self, api_url: str):
        self.api_url = api_url

    def fetch_token_unlocks(self):
        """
        Fetch upcoming token unlock events.
        """
        response = requests.get(f"{self.api_url}/token_unlocks")
        if response.status_code == 200:
            return pd.DataFrame(response.json()['unlocks'])
        else:
            print("Error fetching token unlock events")
            return pd.DataFrame()

    def filter_important_events(self, unlock_data: pd.DataFrame, value_threshold: float = 1000000):
        """
        Filter important unlock events based on value threshold.
        Args:
            unlock_data: DataFrame containing unlock event data.
            value_threshold: Minimum value of unlock event to be considered important.
        """
        return unlock_data[unlock_data['value'] >= value_threshold]

# Example usage
tracker = TokenUnlockEventTracker("https://api.tokenunlocktracker.com")
unlock_events = tracker.fetch_token_unlocks()
print(tracker.filter_important_events(unlock_events, value_threshold=2000000))
