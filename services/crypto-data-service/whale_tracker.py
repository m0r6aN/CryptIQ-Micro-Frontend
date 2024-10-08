# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/whale_tracker.py

import requests

ETHERSCAN_API_KEY = "your_etherscan_api_key"

def fetch_whale_transactions(wallet_address: str, token_address: str = ""):
    url = f"https://api.etherscan.io/api?module=account&action=tokentx&address={wallet_address}&sort=desc&apikey={ETHERSCAN_API_KEY}"
    if token_address:
        url += f"&contractaddress={token_address}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json().get("result", [])
    return []

def track_whale_activity():
    # Add your wallet addresses of interest here
    wallets_of_interest = ["0x1234567890abcdef", "0xabcdef1234567890"]
    whale_movements = {}
    
    for wallet in wallets_of_interest:
        whale_movements[wallet] = fetch_whale_transactions(wallet)
    
    return whale_movements
