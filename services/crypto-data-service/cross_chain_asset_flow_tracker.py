# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/cross_chain_asset_flow_tracker.py

import pandas as pd
import requests

"""
Cross-Chain Asset Flow Tracker
"""

class CrossChainAssetFlowTracker:
    def __init__(self, api_url: str):
        self.api_url = api_url

    def fetch_cross_chain_flows(self):
        """
        Fetch cross-chain asset flows between different blockchains.
        """
        response = requests.get(f"{self.api_url}/cross_chain_flows")
        if response.status_code == 200:
            return pd.DataFrame(response.json()['flows'])
        else:
            print("Error fetching cross-chain flows")
            return pd.DataFrame()

    def analyze_flows(self, flow_data: pd.DataFrame, threshold: float = 1e6):
        """
        Analyze significant cross-chain asset flows.
        Args:
            flow_data: DataFrame containing cross-chain flow data.
            threshold: Minimum flow value to be considered significant.
        """
        return flow_data[flow_data['flow_value'] >= threshold]

# Example usage
tracker = CrossChainAssetFlowTracker("https://api.crosschaintracker.com")
flow_data = tracker.fetch_cross_chain_flows()
print("Significant Cross-Chain Flows:", tracker.analyze_flows(flow_data, threshold=2e6))
