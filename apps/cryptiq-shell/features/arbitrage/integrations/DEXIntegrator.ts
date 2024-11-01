// File: features/arbitrage/integrations/DEXIntegrator.ts

import { ethers } from 'ethers'
import { UniswapV3Handler } from './handlers/UniswapV3Handler'
import { CurveHandler } from './handlers/CurveHandler'
import { BalancerHandler } from './handlers/BalancerHandler'
import { SushiHandler } from './handlers/SushiHandler'
import { OneInchHandler } from './handlers/OneInchHandler'
import { TradeResult } from '@/features/trading/types/trading'
import { PairLiquidity } from '@/features/trading/types/dexTypes'

export interface LiquiditySnapshot {
  dex: string
  pairs: PairLiquidity[]
  lastUpdate: number
  confidence: number
}

export class DEXIntegrator {
  private readonly handlers: Map<string, DEXHandler>
  private readonly provider: ethers.providers.Provider
  private readonly liquidityCache: Map<string, LiquiditySnapshot>
  
  constructor(provider: ethers.providers.Provider) {
    this.provider = provider
    this.handlers = new Map()
    this.liquidityCache = new Map()
    
    // Initialize all DEX handlers
    this.initializeHandlers()
  }

  private initializeHandlers() {
    const handlers = [
      new UniswapV3Handler(this.provider),
      new CurveHandler(this.provider),
      new BalancerHandler(this.provider),
      new SushiHandler(this.provider),
      new OneInchHandler(this.provider)
    ]

    handlers.forEach(handler => {
      this.handlers.set(handler.dexName, handler)
      // Subscribe to liquidity updates
      handler.on('liquidityUpdate', this.handleLiquidityUpdate.bind(this))
    })
  }

  async getLiquiditySnapshots(): Promise<LiquiditySnapshot[]> {
    const snapshots: LiquiditySnapshot[] = []

    // Parallel liquidity fetching from all DEXes
    const snapshotPromises = Array.from(this.handlers.values()).map(async handler => {
      try {
        const pairs = await handler.getLiquidity()
        return {
          dex: handler.dexName,
          pairs,
          lastUpdate: Date.now(),
          confidence: await handler.getConfidenceScore()
        }
      } catch (error) {
        console.error(`Failed to fetch liquidity from ${handler.dexName}:`, error)
        return null
      }
    })

    const results = await Promise.allSettled(snapshotPromises)
    results.forEach(result => {
      if (result.status === 'fulfilled' && result.value) {
        snapshots.push(result.value)
      }
    })

    return snapshots
  }

  async executeTrade(trade: Trade): Promise<TradeResult> {
    const handler = this.handlers.get(trade.dex)
    if (!handler) {
      throw new Error(`No handler found for DEX: ${trade.dex}`)
    }

    // Verify liquidity before execution
    const currentLiquidity = await handler.getSpecificPairLiquidity(
      trade.tokenIn,
      trade.tokenOut
    )

    if (!this.verifyLiquidity(currentLiquidity, trade.amount)) {
      throw new Error('Insufficient liquidity for trade')
    }

    // Execute with fallback options
    try {
      const result = await handler.executeTrade(trade)
      
      // Cache successful execution path
      this.updateExecutionStats(trade.dex, result)
      
      return result
    } catch (error) {
      // Try alternative execution path
      return this.executeWithFallback(trade, error)
    }
  }

  private async executeWithFallback(trade: Trade, originalError: any): Promise<TradeResult> {
    // Sort handlers by success rate
    const rankedHandlers = Array.from(this.handlers.entries())
      .filter(([dex]) => dex !== trade.dex)
      .sort(([, a], [, b]) => b.getSuccessRate() - a.getSuccessRate())

    // Try each alternative handler
    for (const [dex, handler] of rankedHandlers) {
      try {
        const modifiedTrade = { ...trade, dex }
        const result = await handler.executeTrade(modifiedTrade)
        
        // Log successful fallback
        console.log(`Fallback execution successful on ${dex}`)
        
        return result
      } catch (fallbackError) {
        continue // Try next handler
      }
    }

    // If all fallbacks fail, throw original error
    throw originalError
  }

  private updateExecutionStats(dex: string, result: TradeResult) {
    const handler = this.handlers.get(dex)
    if (handler) {
      handler.updateStats({
        success: result.success,
        gasUsed: result.gasUsed,
        executionTime: result.executionTime,
        profit: result.profit
      })
    }
  }

  private handleLiquidityUpdate(update: LiquidityUpdate) {
    this.liquidityCache.set(update.dex, {
      dex: update.dex,
      pairs: update.pairs,
      lastUpdate: Date.now(),
      confidence: update.confidence
    })

    // Trigger opportunity scanning if significant change
    if (update.significantChange) {
      this.emit('significantLiquidityChange', update)
    }
  }
}