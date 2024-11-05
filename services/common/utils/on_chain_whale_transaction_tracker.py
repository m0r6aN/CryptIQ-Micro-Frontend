# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/on_chain_whale_transaction_tracker.py

import pandas as pd
import requests

"""
On-Chain Whale Transaction Tracker
"""

class OnChainWhaleTransactionTracker:
    def __init__(self, provider_url: str):
        self.provider_url = provider_url

    def fetch_whale_transactions(self):
        """
        Fetch on-chain whale transactions.
        """
        response = requests.get(f"{self.provider_url}/whale_transactions")
        if response.status_code == 200:
            return pd.DataFrame(response.json()['transactions'])
        else:
            print("Error fetching whale transactions")
            return pd.DataFrame()

    def track_large_transfers(self, transaction_data: pd.DataFrame, value_threshold: float = 1e6):
        """
        Track large transfers above a specified value threshold.
        Args:
            transaction_data: DataFrame containing on-chain transaction data.
            value_threshold: Minimum transaction value to track.
        """
        return transaction_data[transaction_data['value'] >= value_threshold]

# Example usage
tracker = OnChainWhaleTransactionTracker("https://api.onchaintracker.com")
transaction_data = tracker.fetch_whale_transactions()
print("Large Whale Transfers:", tracker.track_large_transfers(transaction_data, value_threshold=5e6))
