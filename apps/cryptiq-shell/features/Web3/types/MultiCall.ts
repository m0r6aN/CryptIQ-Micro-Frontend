// MultiCall.ts
import { JsonRpcProvider, TransactionRequest } from 'ethers'
import { MultiCallRequest } from './mev_trans_bundler_types'


export class MultiCall {
  constructor(private readonly provider: JsonRpcProvider) {}

  async batch(calls: MultiCallRequest[]) {
    // Aggregate calls into a single multicall
    const results = await Promise.all(
      calls.map(call => 
        this.provider.call({
          to: call.target,
          data: call.callData
        })
      )
    )

    return results.map(result => ({
      success: result !== '0x',
      gasUsed: 0n, // We'd need to estimate this per call
      returnData: result
    }))
  }
}