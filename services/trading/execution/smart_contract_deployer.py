# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/smart_contract_deployer.py

from web3 import Web3

"""
Smart Contract Deployer for DeFi Strategies
"""

class SmartContractDeployer:
    def __init__(self, provider_url: str, private_key: str):
        self.w3 = Web3(Web3.HTTPProvider(provider_url))
        self.account = self.w3.eth.account.privateKeyToAccount(private_key)

    def deploy_contract(self, compiled_contract: dict, constructor_args: list = []):
        """
        Deploy a smart contract to the blockchain.
        Args:
            compiled_contract: The compiled contract (bytecode and ABI).
            constructor_args: Arguments for the contract constructor.
        """
        contract = self.w3.eth.contract(abi=compiled_contract['abi'], bytecode=compiled_contract['bytecode'])
        construct_txn = contract.constructor(*constructor_args).buildTransaction({
            'from': self.account.address,
            'nonce': self.w3.eth.getTransactionCount(self.account.address),
            'gas': 2000000,
            'gasPrice': self.w3.toWei('50', 'gwei')
        })

        signed_txn = self.account.sign_transaction(construct_txn)
        txn_hash = self.w3.eth.sendRawTransaction(signed_txn.rawTransaction)
        print(f"Contract Deployed: {txn_hash.hex()}")

# Example usage
deployer = SmartContractDeployer("https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID", "your_private_key")
