import { Pool } from '../../web3/types/routing'
import { PoolFetcher } from '../../../features/web3/utils/dex-data-pool-fetchers'


export class LiquidityAggregator {
  private pools: Pool[] = []
  private updateInterval: number = 10000 // 10 seconds
  private lastUpdate: number = 0
  private fetcher: PoolFetcher

  constructor(fetcher: PoolFetcher) {
    this.fetcher = fetcher;
  }

  async getSnapshots(){
    return
  }

  async updatePools(): Promise<void> {
    if (Date.now() - this.lastUpdate < this.updateInterval) {
      return
    }

    try {
      // Fetch from multiple DEXes in parallel
      const [
        uniswapPools,
        sushiPools,
        curvePools
      ] = await Promise.all([
        this.fetcher.fetchUniswapPools(),
        this.fetcher.fetchSushiPools(),
        this.fetcher.fetchCurvePools()
      ])

      this.pools = [
        ...uniswapPools,
        ...sushiPools,
        ...curvePools
      ]

      this.lastUpdate = Date.now()
    } catch (error) {
      console.error('Failed to update pools:', error)
      throw error
    }
  }

  getPools(): Pool[] {
    return this.pools
  }

  getPoolsByExchange(exchange: string): Pool[] {
    return this.pools.filter(pool => pool.exchange === exchange)
  }

  calculatePoolHealth(pool: Pool): number {
    const volumeWeight = 0.4
    const liquidityWeight = 0.6
    
    const volumeScore = Math.min(pool.volume24h / 1000000, 1) // Normalize to 1M
    const liquidityScore = Math.min(pool.liquidity / 10000000, 1) // Normalize to 10M
    
    return (volumeScore * volumeWeight) + (liquidityScore * liquidityWeight)
  }
}