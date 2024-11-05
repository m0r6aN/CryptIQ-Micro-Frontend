# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/whale_activity_tracker.py

import requests
import pandas as pd

ETHERSCAN_API_URL = "https://api.etherscan.io/api"
ETHERSCAN_API_KEY = "your_etherscan_api_key"

"""
Whale Wallet Activity Tracker
"""

class WhaleActivityTracker:
    def __init__(self, wallet_addresses: list):
        self.wallet_addresses = wallet_addresses
        self.transaction_data = pd.DataFrame()

    def fetch_transactions(self, wallet_address: str):
        """
        Fetch recent transactions for the given wallet address.
        """
        params = {
            "module": "account",
            "action": "txlist",
            "address": wallet_address,
            "startblock": 0,
            "endblock": 99999999,
            "sort": "desc",
            "apikey": ETHERSCAN_API_KEY
        }
        response = requests.get(ETHERSCAN_API_URL, params=params)
        if response.status_code == 200:
            return pd.DataFrame(response.json().get("result", []))
        else:
            print(f"Error fetching transactions for {wallet_address}")
            return pd.DataFrame()

    def track_wallets(self):
        """
        Track all whale wallets and compile their transaction history.
        """
        all_transactions = []
        for address in self.wallet_addresses:
            print(f"Fetching transactions for {address}")
            transactions = self.fetch_transactions(address)
            transactions['wallet_address'] = address
            all_transactions.append(transactions)

        self.transaction_data = pd.concat(all_transactions, ignore_index=True)

    def detect_large_movements(self, threshold: float = 100000):
        """
        Detects large transactions above the specified threshold.
        """
        large_movements = self.transaction_data[self.transaction_data['value'].astype(float) > threshold]
        return large_movements

# Example usage
tracker = WhaleActivityTracker(["0xSomeWhaleAddress1", "0xSomeWhaleAddress2"])
tracker.track_wallets()
print(tracker.detect_large_movements(500000))
