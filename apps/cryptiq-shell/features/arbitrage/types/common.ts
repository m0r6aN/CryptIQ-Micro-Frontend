// features/arbitrage/types/common.ts
import { Pool } from './pools'

export interface PoolUpdate {
  poolId: string
  timestamp: number
  reserves: string[]
  price: string
}

export interface PoolStats {
  volume24h: bigint
  tvl: bigint
  fees24h: bigint
  apy?: number
  volatility?: number
}

export interface PoolLiquidity {
  pool: Pool
  stats: PoolStats
  lastUpdate: number
}