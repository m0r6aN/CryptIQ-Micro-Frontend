# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/data_aggregator.py

import requests
import json

COINMARKETCAP_API_KEY = "your_coinmarketcap_api_key"
LUNARCRUSH_API_KEY = "your_lunarcrush_api_key"

def fetch_coinmarketcap_data():
    headers = {'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY}
    url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest"
    response = requests.get(url, headers=headers)
    return response.json() if response.status_code == 200 else None

def fetch_lunarcrush_social_data():
    headers = {'Authorization': f'Bearer {LUNARCRUSH_API_KEY}'}
    url = "https://lunarcrush.com/api4/coins"
    response = requests.get(url, headers=headers)
    return response.json() if response.status_code == 200 else None

def aggregate_market_data():
    market_data = fetch_coinmarketcap_data()
    social_data = fetch_lunarcrush_social_data()
    return {"market_data": market_data, "social_data": social_data}
