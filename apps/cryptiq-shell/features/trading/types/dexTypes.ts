// File: features/trading/types/dexTypes.ts

import { BigNumber } from 'ethers'
import { Trade, TradeResult } from './trading'

export interface DexHandler {
  readonly dexName: string
  getLiquidity(): Promise<PairLiquidity[]>
  getSpecificPairLiquidity(tokenIn: string, tokenOut: string): Promise<PairLiquidity>
  executeTrade(trade: Trade): Promise<TradeResult>
  getSuccessRate(): number
  updateStats(stats: ExecutionStats): void
}

export interface PairLiquidity {
  tokenIn: string
  tokenOut: string
  liquidity: BigNumber
  price: number
  lastUpdate: number
  reserves?: [BigNumber, BigNumber]
  fee?: number
}

export interface ExecutionStats {
  success: boolean
  gasUsed: BigNumber
  executionTime: number
  profit: BigNumber
}

export interface BalancerPath {
  poolId: string
  tokens: string[]
  swaps: Array<{
    poolId: string
    tokenInIndex: number
    tokenOutIndex: number
    amount: BigNumber
    userData: string
  }>
  limits: BigNumber[]
  expectedReturn: BigNumber
  minimumReturn: BigNumber
}

export interface BatchSwapParams {
  kind: number // 0 for GIVEN_IN, 1 for GIVEN_OUT
  swaps: Array<{
    poolId: string
    assetInIndex: number
    assetOutIndex: number
    amount: BigNumber
    userData: string
  }>
  assets: string[]
  funds: {
    sender: string
    recipient: string
    fromInternalBalance: boolean
    toInternalBalance: boolean
  }
  limits: BigNumber[]
  deadline: number
}