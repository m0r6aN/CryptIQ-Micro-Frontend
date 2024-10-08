# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/onchain_transaction_fee_analyzer.py

from web3 import Web3

"""
On-Chain Transaction Fee Analyzer
"""

class OnChainTransactionFeeAnalyzer:
    def __init__(self, provider_url: str):
        self.w3 = Web3(Web3.HTTPProvider(provider_url))

    def analyze_fees(self, from_address: str):
        """
        Analyze historical transaction fees for a given wallet address.
        Args:
            from_address: Ethereum wallet address to analyze.
        """
        txs = self.w3.eth.get_transaction_count(from_address)
        fees = []

        for i in range(txs):
            tx = self.w3.eth.get_transaction_by_block(from_address, i)
            fee = tx['gas'] * tx['gasPrice']
            fees.append({'tx_hash': tx['hash'], 'fee_in_gwei': self.w3.fromWei(fee, 'gwei')})

        return fees

# Example usage
analyzer = OnChainTransactionFeeAnalyzer("https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID")
print(analyzer.analyze_fees("0xYourEthereumAddress"))
