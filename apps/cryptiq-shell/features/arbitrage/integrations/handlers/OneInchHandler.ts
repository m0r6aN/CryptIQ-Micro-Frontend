// File: features/arbitrage/integrations/handlers/OneInchHandler.ts

import { PairLiquidity } from '@/features/trading/types/dexTypes'
import { ethers } from 'ethers'
import { ONEINCH_AGGREGATOR_ADDRESS } from '../../../trading/constants/dexConstants'
import { ExecutionStatsManager } from '@/features/trading/managers/ExecutionStatsManager'

export class OneInchHandler implements DEXHandler {
    private readonly provider: ethers.providers.Provider
    private readonly aggregatorContract: ethers.Contract
    private readonly statsManager: ExecutionStatsManager
    private lastUpdate: number = 0
  
    constructor(provider: ethers.providers.Provider) {
      this.provider = provider
      this.aggregatorContract = new ethers.Contract(
        ONEINCH_AGGREGATOR_ADDRESS,
        AGGREGATOR_ABI,
        provider
      )
      this.statsManager = new ExecutionStatsManager()
    }
  
    async getLiquidity(): Promise<PairLiquidity[]> {
      const pools = await this.aggregatorContract.getActivePools()
      
      return Promise.all(pools.map(async pool => {
        const liquidity = await this.getPoolLiquidity(pool)
        return {
          tokenIn: pool.token0,
          tokenOut: pool.token1,
          liquidity: liquidity.toString(),
          price: await this.getPrice(pool.token0, pool.token1),
          lastUpdate: Date.now()
        }
      }))
    }
  
    async executeTrade(trade: Trade): Promise<TradeResult> {
      // Get best split route
      const route = await this.aggregatorContract.findBestRoute(
        trade.tokenIn,
        trade.tokenOut,
        trade.amount
      )
  
      // Estimate gas and check profitability
      const gasEstimate = await this.estimateGas(route)
      if (!this.isProfitable(route.returnAmount, gasEstimate)) {
        throw new Error('Trade not profitable after gas costs')
      }
  
      // Execute with split routes for minimal price impact
      const tx = await this.aggregatorContract.swap(
        route.parts,
        route.routes,
        trade.amount,
        trade.minReturn,
        { gasLimit: gasEstimate.mul(12).div(10) } // 20% buffer
      )
  
      const receipt = await tx.wait()
      
      return {
        success: true,
        gasUsed: receipt.gasUsed,
        executionTime: Date.now() - trade.timestamp,
        profit: this.calculateProfit(route.returnAmount, receipt.gasUsed)
      }
    }
  
    private async estimateGas(route: any): Promise<BigNumber> {
      try {
        // Simulate transaction
        const gasEstimate = await this.aggregatorContract.estimateGas.swap(
          route.parts,
          route.routes,
          route.amount,
          route.minReturn
        )
  
        return gasEstimate
      } catch (error) {
        console.error('Gas estimation failed:', error)
        throw new Error('Failed to estimate gas')
      }
    }
  
    private isProfitable(
      returnAmount: BigNumber,
      gasEstimate: BigNumber
    ): boolean {
      const gasCost = gasEstimate.mul(
        ethers.utils.parseUnits('30', 'gwei') // Adjust based on network
      )
      
      return returnAmount.gt(gasCost.mul(120).div(100)) // 20% profit margin
    }
  
    private calculateProfit(
      returnAmount: BigNumber,
      gasUsed: BigNumber
    ): BigNumber {
      const gasCost = gasUsed.mul(
        ethers.utils.parseUnits('30', 'gwei')
      )
      return returnAmount.sub(gasCost)
    }
  }