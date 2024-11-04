// features/arbitrage/safety/HealthMetricsCalculator.ts

import { ethers, formatUnits } from 'ethers'
import { HealthMetrics } from './HealthMetrics'
import { poolABI } from 'features/web3/config/contract+abis';

export class HealthMetricsCalculator {
  private readonly provider: ethers.JsonRpcProvider
  private readonly priceCache: Map<string, { price: number; timestamp: number }>
  private readonly CACHE_DURATION = 30_000
  private volatilityHistory: number[] = []
  private latencyMeasurements: number[] = []
  private backlog: Set<string> = new Set()
  private trackedTokens: [] = []
  private walletAddress: string = ""

  constructor(
    provider: ethers.JsonRpcProvider,
    priceCache: Map<string, { price: number; timestamp: number }>
  ) {
    this.provider = provider
    this.priceCache = priceCache
  }

  public async calculateLiquidityScore(liquidityDepth: number): Promise<number> {
    // Score from 0-100 based on liquidity depth and distribution
    const MIN_ACCEPTABLE_LIQUIDITY = 50000 // $50k
    const OPTIMAL_LIQUIDITY = 1000000    // $1M
    
    if (liquidityDepth <= MIN_ACCEPTABLE_LIQUIDITY) return 0
    if (liquidityDepth >= OPTIMAL_LIQUIDITY) return 100
    
    return ((liquidityDepth - MIN_ACCEPTABLE_LIQUIDITY) / 
      (OPTIMAL_LIQUIDITY - MIN_ACCEPTABLE_LIQUIDITY)) * 100
  }

  public async calculateSlippageImpact(
    amount: bigint,
    poolAddress: string
  ): Promise<number> {
    try {
      const pool = new ethers.Contract(poolAddress, poolABI, this.provider)
      const reserves = await pool.getReserves()
      
      // Calculate price impact using constant product formula
      const k = reserves[0] * reserves[1]
      const newReserve0 = reserves[0] + amount
      const newReserve1 = k / newReserve0
      const priceImpact = ((reserves[1] - newReserve1) / reserves[1]) * 100
      
      return Number(priceImpact.toFixed(4))
    } catch (error) {
      console.error('Failed to calculate slippage impact:', error)
      return Infinity
    }
  }

  public async calculateToxicityScore(): Promise<number> {
    try {
      // Factors that contribute to toxicity:
      // 1. Recent failed transactions
      // 2. Suspicious mempool activity
      // 3. Price volatility
      // 4. Wash trading detection
      
      const [failedTxScore, mempoolScore, volatilityScore, washScore] = 
        await Promise.all([
          this.getFailedTransactionsScore(),
          this.getMempoolToxicityScore(),
          this.getVolatilityScore(),
          this.getWashTradingScore()
        ])

      // Weighted average of all factors
      return (
        (failedTxScore * 0.3) +
        (mempoolScore * 0.3) +
        (volatilityScore * 0.2) +
        (washScore * 0.2)
      )
    } catch (error) {
      console.error('Failed to calculate toxicity score:', error)
      return 100 // Assume worst case for safety
    }
  }

  public async calculateVolatilityIndex(): Promise<number> {
    try {
      // Calculate rolling volatility using price history
      const prices = this.volatilityHistory.slice(-20)
      if (prices.length < 2) return 0
      
      const returns = prices.slice(1).map((price, i) => 
        Math.log(price / prices[i])
      )
      
      const meanReturn = returns.reduce((a, b) => a + b) / returns.length
      const variance = returns.reduce((sum, ret) => 
        sum + Math.pow(ret - meanReturn, 2), 0
      ) / returns.length
      
      return Math.sqrt(variance) * 100 // Annualized volatility
    } catch (error) {
      console.error('Failed to calculate volatility index:', error)
      return Infinity
    }
  }

  public calculateProfitRatio(
    expectedProfit: number,
    gasCost: number,
    slippage: number
  ): number {
    // Ratio of expected profit to costs (gas + slippage)
    const totalCost = gasCost + slippage
    if (totalCost === 0) return 0
    return expectedProfit / totalCost
  }

  public async measureNodeLatency(): Promise<number> {
    try {
      const start = Date.now()
      await this.provider.getBlockNumber()
      const latency = Date.now() - start
      
      this.latencyMeasurements = [
        ...this.latencyMeasurements.slice(-9),
        latency
      ]
      
      return this.latencyMeasurements.reduce((a, b) => a + b) / 
        this.latencyMeasurements.length
    } catch (error) {
      console.error('Failed to measure node latency:', error)
      return Infinity
    }
  }

  public getBacklogSize(): number {
    return this.backlog.size
  }

  public async getPortfolioValue(): Promise<number> {
    try {
      let totalValue = 0;
      
      // Get balances of tracked tokens
      for (const token of this.trackedTokens) {
        const contract = new ethers.Contract(token.address, erc20ABI, this.provider);
        
        // Fetch balance of the token for the specified wallet address
        const balance = await contract.balanceOf(this.walletAddress);
        
        // Get the price of the token (ensure getTokenPrice is implemented elsewhere)
        const price = await this.getTokenPrice(token.address);
        
        // Calculate total value for this token and add it to the portfolio value
        totalValue += Number(formatUnits(balance, token.decimals)) * price;
      }
  
      return totalValue;
    } catch (error) {
      console.error('Failed to get portfolio value:', error);
      return 0;  // Return zero on failure for safety
    }
  }

  // Helper methods
  private async getFailedTransactionsScore(): Promise<number> {
    try {
      const recentTransactions = await this.provider.getHistory(this.walletAddress);
      
      // Check the status of each transaction
      const failedTxCount = recentTransactions.filter(tx => tx.status === 0).length;
      
      // Calculate the failure score (0-100 based on percentage of failed txs)
      const failureRate = (failedTxCount / recentTransactions.length) * 100;
  
      return failureRate;  // A failure rate of 100 means all recent transactions failed
    } catch (error) {
      console.error('Failed to analyze failed transactions:', error);
      return 100;  // Default to the worst case if error occurs
    }
  }

  private async getMempoolToxicityScore(): Promise<number> {
    try {
      const pendingBlock = await this.provider.send("eth_getBlockByNumber", ["pending", true]);
      
      // Calculate toxicity based on the number of pending transactions
      const pendingTransactions = pendingBlock.transactions.length;
      
      // For example, a high number of pending transactions could increase toxicity
      const highPendingTxThreshold = 1000;  // Set your own threshold
      const toxicityScore = Math.min((pendingTransactions / highPendingTxThreshold) * 100, 100);
      
      return toxicityScore;
    } catch (error) {
      console.error('Failed to calculate mempool toxicity score:', error);
      return 100;  // Return a worst-case scenario
    }
  }

  private async getVolatilityScore(): Promise<number> {
    try {
      // Assuming you store token prices in volatilityHistory[]
      const prices = this.volatilityHistory.slice(-20);  // Use the last 20 price points
  
      if (prices.length < 2) return 0;
  
      const returns = prices.slice(1).map((price, i) => Math.log(price / prices[i]));
      const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
      const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - meanReturn, 2), 0) / returns.length;
  
      // Return volatility as a percentage (annualized)
      return Math.sqrt(variance) * 100;
    } catch (error) {
      console.error('Failed to calculate volatility score:', error);
      return 100;  // Worst case scenario
    }
  }

  private async getWashTradingScore(): Promise<number> {
    try {
      // You can analyze recent trades for repetitive patterns
      const recentTrades = await this.getRecentTrades(this.walletAddress);  // Implement this method
      const repetitiveTrades = recentTrades.filter((trade, i, arr) => 
        i > 0 && arr[i - 1].to === trade.from && arr[i - 1].value === trade.value
      );
      
      // Higher percentage of repetitive trades could indicate wash trading
      const washTradeRate = (repetitiveTrades.length / recentTrades.length) * 100;
      
      return washTradeRate;  // Scale score 0-100 based on wash trade rate
    } catch (error) {
      console.error('Failed to detect wash trading:', error);
      return 100;  // Assume worst case
    }
  }  
}