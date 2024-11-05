# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/real_time_aggregator.py

import requests
import time

"""
Real-Time Market Data Aggregation
"""

EXCHANGE_API_URL = "https://api.coingecko.com/api/v3/coins/markets"
SOCIAL_API_URL = "https://lunarcrush.com/api4"

def fetch_exchange_data():
    """
    Fetches real-time market data from CoinGecko.
    """
    response = requests.get(EXCHANGE_API_URL, params={"vs_currency": "usd", "order": "market_cap_desc"})
    return response.json() if response.status_code == 200 else None

def fetch_social_data():
    """
    Fetches real-time social sentiment data from LunarCrush.
    """
    headers = {'Authorization': 'Bearer your_lunarcrush_api_key'}
    response = requests.get(f"{SOCIAL_API_URL}/coins", headers=headers)
    return response.json() if response.status_code == 200 else None

def real_time_data_aggregator():
    """
    Continuously fetches and aggregates real-time data.
    """
    while True:
        exchange_data = fetch_exchange_data()
        social_data = fetch_social_data()
        combined_data = {"market_data": exchange_data, "social_data": social_data}
        print(f"Real-Time Data: {combined_data}")
        time.sleep(5)  # Pause for 5 seconds between fetches
