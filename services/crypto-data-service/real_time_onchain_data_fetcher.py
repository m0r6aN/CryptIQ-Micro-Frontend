# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/real_time_onchain_data_fetcher.py

from web3 import Web3

"""
Real-Time On-Chain Data Fetcher
"""

class RealTimeOnChainDataFetcher:
    def __init__(self, provider_url: str):
        self.w3 = Web3(Web3.HTTPProvider(provider_url))

    def fetch_latest_block(self):
        """
        Fetch the latest block data from the blockchain.
        """
        latest_block = self.w3.eth.get_block('latest')
        return latest_block

    def fetch_address_balance(self, address: str):
        """
        Fetch the balance of a specified Ethereum address.
        Args:
            address: Ethereum wallet address.
        """
        balance = self.w3.eth.get_balance(address)
        return self.w3.fromWei(balance, 'ether')

# Example usage
fetcher = RealTimeOnChainDataFetcher("https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID")
print("Latest Block:", fetcher.fetch_latest_block())
print("Address Balance:", fetcher.fetch_address_balance("0xYourEthereumAddress"))
