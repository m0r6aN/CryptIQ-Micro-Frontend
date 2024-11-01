import { createPublicClient, webSocket } from 'viem'
import { mainnet } from 'viem/chains'
import { ArbitrageContract } from '@cryptiq/web3-sdk'

export class BlockchainService {
  private client = createPublicClient({
    chain: mainnet,
    transport: webSocket(process.env.WSS_URL!)
  })

  async monitorArbitrage(contract: ArbitrageContract) {
    return this.client.watchContractEvent({
      address: contract.address,
      abi: contract.abi,
      eventName: 'ArbitrageExecuted',
      onLogs: (logs) => {
        // Handle arbitrage events
        console.log('Arbitrage executed:', logs)
      }
    })
  }

  async getGasPrice() {
    return this.client.getGasPrice()
  }
}