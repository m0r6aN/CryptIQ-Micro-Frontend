// GasOptimizer.ts
import { JsonRpcProvider } from 'ethers'

interface GasSettings {
  gasLimit: bigint
  simulatedGasUsed?: bigint
}

export class GasOptimizer {
  private readonly multiplier: number

  constructor(
    private readonly provider: JsonRpcProvider,
    multiplier = 1.1
  ) {
    this.multiplier = multiplier
  }

  async optimizeGasPrice({ gasLimit, simulatedGasUsed }: GasSettings) {
    const feeData = await this.provider.getFeeData()
    const baseGasLimit = simulatedGasUsed || gasLimit

    return {
      price: feeData.gasPrice || 0n,
      limit: BigInt(Math.ceil(Number(baseGasLimit) * this.multiplier))
    }
  }
}