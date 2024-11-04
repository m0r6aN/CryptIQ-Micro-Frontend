// features/arbitrage/types/pools.ts
import { PoolProtocol, BasePool } from './protocols'

export interface BalancerPool extends BasePool {
  protocol: PoolProtocol.Balancer
  weights: number[]
  swapFee: number
}

export interface UniswapV3Pool extends BasePool {
  protocol: PoolProtocol.UniswapV3
  fee: number
  tickSpacing: number
  sqrtPriceX96: bigint
  liquidity: bigint
  tick: number
}

export interface CurvePool extends BasePool {
  protocol: PoolProtocol.Curve
  A: number
  fee: number
  adminFee: number
  virtualPrice: bigint
}

export type Pool = BalancerPool | UniswapV3Pool | CurvePool