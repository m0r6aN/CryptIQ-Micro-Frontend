# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/smart_contract_interactor.py

from web3 import Web3

"""
Smart Contract Interaction Module
"""

class SmartContractInteractor:
    def __init__(self, provider_url: str, contract_address: str, abi: list):
        self.w3 = Web3(Web3.HTTPProvider(provider_url))
        self.contract = self.w3.eth.contract(address=contract_address, abi=abi)

    def call_function(self, function_name: str, *args):
        """
        Call a function on the smart contract.
        """
        try:
            contract_function = getattr(self.contract.functions, function_name)
            result = contract_function(*args).call()
            return result
        except Exception as e:
            print(f"Error calling contract function: {e}")

    def send_transaction(self, function_name: str, account: str, private_key: str, *args):
        """
        Send a transaction to the smart contract.
        """
        try:
            contract_function = getattr(self.contract.functions, function_name)
            transaction = contract_function(*args).buildTransaction({
                'nonce': self.w3.eth.getTransactionCount(account),
                'gas': 2000000,
                'gasPrice': self.w3.toWei('50', 'gwei')
            })

            signed_txn = self.w3.eth.account.sign_transaction(transaction, private_key)
            txn_hash = self.w3.eth.sendRawTransaction(signed_txn.rawTransaction)
            return txn_hash.hex()
        except Exception as e:
            print(f"Error sending transaction: {e}")

# Example usage
abi = [{"constant": True, "inputs": [], "name": "name", "outputs": [{"name": "", "type": "string"}], "type": "function"}]
interactor = SmartContractInteractor("https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID", "0xTokenAddress", abi)
print(interactor.call_function("name"))
