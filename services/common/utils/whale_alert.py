# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/whale_alert.py

import requests

"""
Whale Wallet Analysis with Alert System
"""

ETHERSCAN_API_KEY = "your_etherscan_api_key"

def fetch_whale_transactions(wallet_address: str, token_address: str = ""):
    """
    Fetch recent transactions for a given wallet.
    """
    url = f"https://api.etherscan.io/api?module=account&action=tokentx&address={wallet_address}&sort=desc&apikey={ETHERSCAN_API_KEY}"
    if token_address:
        url += f"&contractaddress={token_address}"
    response = requests.get(url)
    return response.json().get("result", []) if response.status_code == 200 else []

def analyze_whale_activity(wallet_address: str, token_address: str = ""):
    """
    Analyze whale activity and send alerts based on transaction volume.
    """
    transactions = fetch_whale_transactions(wallet_address, token_address)
    high_value_transactions = [tx for tx in transactions if float(tx['value']) > 100000]  # Filter high-value txs

    if high_value_transactions:
        print(f"ALERT: Whale activity detected for {wallet_address}. Transactions: {high_value_transactions}")
