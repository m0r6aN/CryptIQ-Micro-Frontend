// pool-tracker.ts
import { ethers } from 'ethers'
import { BalancerPool, Pool } from './pools'
import { PoolStats } from './common'
import { PoolUpdate } from './common'
import { PoolProtocol } from './protocols'


export class PoolTracker {
  private pools: Map<string, Pool> = new Map()
  private poolStats: Map<string, PoolStats> = new Map()
    private poolUpdates: Map<string, PoolUpdate[]> = new Map()
    private readonly provider: ethers.Provider
    private readonly POOL_REGISTRY_ADDRESS: string = '0x...' // Add your registry address
    private readonly POOL_REGISTRY_ABI = [/* Add registry ABI */]
  
    constructor(provider: ethers.Provider) {
      this.provider = provider
      this.initializeTracking()
    }
  
    private async initializeTracking() {
      // Subscribe to pool events
      this.subscribeToPoolEvents()
      // Initial pool load
      await this.loadAllPools()
    }
  
    private async subscribeToPoolEvents() {
      // Subscribe to relevant events
      this.provider.on('block', async (blockNumber) => {
        await this.updatePoolStates(blockNumber)
      })
    }
  
    private async loadAllPools(): Promise<void> {
      try {
        const registry = new ethers.Contract(
          this.POOL_REGISTRY_ADDRESS,
          this.POOL_REGISTRY_ABI,
          this.provider
        )
  
        const poolAddresses = await registry.getAllPools()
        
        for (const address of poolAddresses) {
          const poolData = await this.fetchPoolData(address)
          this.pools.set(poolData.id, poolData)
        }
      } catch (error) {
        console.error('Failed to load pools:', error)
        throw error
      }
    }
  
    async getAllPools(): Promise<Pool[]> {
      if (this.pools.size === 0) {
        await this.loadAllPools()
      }
      return Array.from(this.pools.values())
    }
  
    async getViablePools(tokenIn: string, tokenOut: string): Promise<Pool[]> {
      const allPools = await this.getAllPools()
      return allPools.filter(pool => 
        pool.tokens.includes(tokenIn) && 
        pool.tokens.includes(tokenOut) &&
        this.isPoolViable(pool)
      )
    }
  
    private isPoolViable(pool: Pool): boolean {
      const minLiquidity = ethers.parseEther('100000') // Example threshold
      return BigInt(pool.totalLiquidity) >= minLiquidity
    }
  
    private async updatePoolStates(blockNumber: number) {
      for (const [poolId, pool] of this.pools) {
        try {
          const newState = await this.fetchPoolState(pool.address, blockNumber)
          this.updatePoolHistory(poolId, newState)
        } catch (error) {
          console.error(`Failed to update pool ${poolId}:`, error)
        }
      }
    }
  
    private updatePoolHistory(poolId: string, update: PoolUpdate) {
      const updates = this.poolUpdates.get(poolId) || []
      updates.push(update)
      
      // Keep last 100 updates
      if (updates.length > 100) {
        updates.shift()
      }
      
      this.poolUpdates.set(poolId, updates)
    }
  
    private async fetchPoolData(address: string): Promise<Pool> {
        const protocol = await this.detectPoolProtocol(address)
      
        switch (protocol) {
          case PoolProtocol.Balancer:
            return this.fetchBalancerPool(address)
          case PoolProtocol.UniswapV3:
            return this.fetchUniswapV3Pool(address)
          case PoolProtocol.Curve:
            return this.fetchCurvePool(address)
          default:
            throw new Error(`Unsupported pool protocol: ${protocol}`)
        }
      }

      private async fetchBalancerPool(address: string): Promise<BalancerPool> {
        const poolContract = new ethers.Contract(
          address,
          [/* Add pool ABI */],
          this.provider
        )
      
        const [id, tokens, weights, swapFee, totalLiquidity, reserves] = await Promise.all([
          poolContract.getPoolId(),
          poolContract.getTokens(),
          poolContract.getNormalizedWeights(),
          poolContract.getSwapFeePercentage(),
          poolContract.getTotalLiquidity(),
          poolContract.getReserves()
        ])
      
        return {
          id,
          address,
          protocol: PoolProtocol.Balancer,  // Add this
          tokens,
          weights: weights.map((w: bigint) => Number(w) / 1e18),
          swapFee: Number(swapFee) / 1e18,
          totalLiquidity,
          reserves
        }
      }
  
    private async fetchPoolState(
      address: string, 
      blockNumber: number
    ): Promise<PoolUpdate> {
      const poolContract = new ethers.Contract(
        address,
        [/* Add pool ABI */],
        this.provider
      )
  
      const [reserves, price] = await Promise.all([
        poolContract.getReserves({ blockTag: blockNumber }),
        poolContract.getPrice({ blockTag: blockNumber })
      ])
  
      return {
        poolId: address,
        timestamp: Date.now(),
        reserves: reserves.map((r: bigint) => r.toString()),
        price: price.toString()
      }
    }
  
    // Additional utility methods
    async getPoolHistory(poolId: string): Promise<PoolUpdate[]> {
      return this.poolUpdates.get(poolId) || []
    }
  
    async getPoolVolatility(poolId: string): Promise<number> {
      const updates = await this.getPoolHistory(poolId)
      if (updates.length < 2) return 0
  
      // Calculate price volatility
      const prices = updates.map(u => Number(u.price))
      return this.calculateVolatility(prices)
    }
  
    private calculateVolatility(prices: number[]): number {
      if (prices.length < 2) return 0
      
      const returns = prices.slice(1).map((price, i) => 
        Math.log(price / prices[i])
      )
      
      const mean = returns.reduce((a, b) => a + b) / returns.length
      const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length
      
      return Math.sqrt(variance)
    }
  }
  