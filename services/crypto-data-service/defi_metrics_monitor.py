# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/defi_metrics_monitor.py

import requests
import pandas as pd

"""
DeFi Metrics Monitor
"""

DEFI_PULSE_URL = "https://public.defipulse.com/api/GetHistory"
DEFI_PULSE_API_KEY = "your_defipulse_api_key"

def fetch_defi_metrics():
    """
    Fetch DeFi metrics such as TVL (Total Value Locked) and lending rates.
    """
    response = requests.get(f"{DEFI_PULSE_URL}?api-key={DEFI_PULSE_API_KEY}")
    return pd.DataFrame(response.json()) if response.status_code == 200 else None

def monitor_defi_trends():
    """
    Continuously monitor DeFi trends and highlight significant changes.
    """
    metrics = fetch_defi_metrics()
    if metrics is not None:
        metrics['change'] = metrics['tvlUsd'].pct_change()
        spikes = metrics[metrics['change'].abs() > 0.1]  # Detect > 10% changes in TVL
        print(f"DeFi TVL Spikes Detected: {spikes}")
