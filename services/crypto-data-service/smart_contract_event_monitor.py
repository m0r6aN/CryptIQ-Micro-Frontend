# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/smart_contract_event_monitor.py

from web3 import Web3

"""
 Smart Contract Event Monitor
"""

class SmartContractEventMonitor:
    def __init__(self, provider_url: str, contract_address: str, abi: list):
        self.w3 = Web3(Web3.HTTPProvider(provider_url))
        self.contract = self.w3.eth.contract(address=contract_address, abi=abi)

    def listen_for_events(self, event_name: str):
        """
        Listen for a specified event emitted by the contract.
        """
        event_filter = self.contract.events.__dict__[event_name].createFilter(fromBlock='latest')
        while True:
            for event in event_filter.get_new_entries():
                print(f"New Event: {event}")
