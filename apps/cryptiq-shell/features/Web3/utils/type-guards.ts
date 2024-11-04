import { Pool } from "../types/routing";

export function isPool(pool: any): pool is Pool {
    return (
      pool !== null &&
      typeof pool === 'object' &&
      typeof pool.exchange === 'string' &&
      typeof pool.pair === 'string' &&
      typeof pool.liquidity === 'string' &&
      typeof pool.volume24h === 'number' &&
      typeof pool.price === 'number' &&
      typeof pool.fee === 'number' &&
      typeof pool.address === 'string'
    )
  }
  