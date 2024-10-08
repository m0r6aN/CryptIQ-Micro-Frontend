# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/governance_voting_monitor.py

import requests
import pandas as pd

"""
On-Chain Governance Voting Monitor
"""

class GovernanceVotingMonitor:
    def __init__(self, api_url: str, protocol: str):
        self.api_url = api_url
        self.protocol = protocol

    def fetch_active_proposals(self):
        """
        Fetch active governance proposals for the specified protocol.
        """
        response = requests.get(f"{self.api_url}/protocols/{self.protocol}/governance")
        if response.status_code == 200:
            return pd.DataFrame(response.json()['proposals'])
        else:
            print(f"Error fetching proposals for {self.protocol}")
            return pd.DataFrame()

    def monitor_proposal_votes(self, proposal_id: str):
        """
        Monitor votes for a specific governance proposal.
        """
        response = requests.get(f"{self.api_url}/proposals/{proposal_id}/votes")
        if response.status_code == 200:
            return pd.DataFrame(response.json()['votes'])
        else:
            print(f"Error fetching votes for proposal {proposal_id}")
            return pd.DataFrame()

# Example usage
monitor = GovernanceVotingMonitor("https://api.protocol.io", "Compound")
proposals = monitor.fetch_active_proposals()
print(monitor.monitor_proposal_votes(proposals.iloc[0]['id']))
