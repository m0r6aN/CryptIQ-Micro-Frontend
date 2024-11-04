// File: features/arbitrage/safety/SafetyManager.ts

import { ArbRoute, TradeStep } from "features/arbitrage/types/arbitrage-system-types"
import { ArbitrageOpportunity } from "features/web3/components/FlashLoanArbitrage"
import { Pool } from "features/web3/types/routing"
import { SafetyThresholds } from "./SafetyThresholds"
import { HealthMetrics } from "./HealthMetrics"
import { HealthMetricsCalculator } from './HealthMetricsCalculator'
import { ethers, formatUnits } from "ethers"
import { poolABI, priceOracleABI } from "features/web3/config/contract+abis"
   
  interface CurrentPool {
    address: string
    token0: string
    token1: string
    token0Decimals: number
    token1Decimals: number
  }

  const PRICE_ORACLE_ADDRESS = process.env.PRICE_ORACLE_ADDRESS as string

  export class SafetyManager {
    private readonly thresholds: SafetyThresholds
    private readonly healthHistory: HealthMetrics[]
    private isCircuitBroken: boolean
    private lastExecutionTime: number
    private priceCache: Map<string, { price: number; timestamp: number }> = new Map()
    private readonly CACHE_DURATION = 30_000 // 30 seconds cache
    private readonly provider: ethers.JsonRpcProvider
    private currentPools: CurrentPool[] = []
    private readonly metricsCalculator: HealthMetricsCalculator
  
    constructor(thresholds: SafetyThresholds) {
      this.thresholds = thresholds
      this.healthHistory = []
      this.isCircuitBroken = false
      this.lastExecutionTime = Date.now()
      this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
      this.currentPools = []
      this.metricsCalculator = new HealthMetricsCalculator(
        this.provider,
        this.priceCache
      )
     }
  
    async checkExecution(route: ArbRoute): Promise<boolean> {
      const metrics = await this.gatherHealthMetrics()
      this.healthHistory.push(metrics)
  
      // Circuit breaker conditions
      if (
        metrics.currentDrawdown > this.thresholds.maxDrawdown ||
        metrics.averageGasPrice > this.thresholds.maxGasPrice ||
        metrics.successRate < (1 - this.thresholds.failureRateThreshold) ||
        Date.now() - this.lastExecutionTime > this.thresholds.maxExecutionTime
      ) {
        this.triggerCircuitBreaker('Safety threshold breached')
        return false
      }
  
      // Route-specific checks
      if (!this.validateRoute(route, metrics)) {
        return false
      }
  
      return true
    }

    private verifyArbitrageOpportunity = (opp: ArbitrageOpportunity, pools: Pool[]) => {
      // Basic safety checks
      const minLiquidity = 50000 // $50k minimum liquidity
      const maxSlippage = 0.01  // 1% max slippage
      const minProfit = 50      // $50 minimum profit after gas
    
      const poolsHaveEnoughLiquidity = opp.pools.every(pool => {
        const matchingPool = pools.find(p => p.address === pool.name)
        return matchingPool && matchingPool.liquidity > minLiquidity
      })
    
      const isProfitable = (opp.profitUSD - opp.estimatedGas) > minProfit
      const isLowSlippage = opp.expectedSlippage < maxSlippage
    
      return poolsHaveEnoughLiquidity && isProfitable && isLowSlippage ? opp : null
    }
  
    private async validateRoute(route: ArbRoute, metrics: HealthMetrics): Promise<boolean> {

      // Validate each step of the arbitrage route
      for (const step of route.executionSteps) {
        if (!this.validateTradeStep(step, metrics)) {
          return false
        }
      }
  
      // Check for sandwich attack protection     
      const detected = (await this.detectSandwichRisk(route))

      if (detected) {
        console.warn('🥪 Potential sandwich attack detected')
        return false
      }
  
      // Validate flash loan terms
      if (!this.validateFlashLoanTerms(route)) {
        return false
      }
  
      return true
    }

    private async validateTradeStep(step: TradeStep, metrics: HealthMetrics): Promise<boolean> {
      // Check liquidity depth for this step
      if (metrics.liquidityDepth < this.thresholds.minLiquidity) {
        console.warn(`⚠️ Insufficient liquidity for trade step: ${step.exchange}`)
        return false
      }
    
      // Verify execution time is within limits
      if (metrics.averageExecutionTime > this.thresholds.maxExecutionTime) {
        console.warn(`⚠️ Execution time exceeding threshold: ${step.exchange}`)
        return false
      }
    
      // Additional step-specific validations
      const slippageOK = Number(step.minReturn) / Number(step.amount) > 0.995 // Max 0.5% slippage
      const amountOK = Number(step.amount) > 0
    
      return slippageOK && amountOK
    }

    private async detectSandwichRisk(route: ArbRoute): Promise<boolean> {
      const someThreshold = ethers.parseEther("1") // 1 ETH or adjust as needed
      const mempool = await this.getMempoolTransactions()
      const suspiciousTransactions = mempool.filter(tx => 
        tx.to === route.executionSteps[0].exchange &&
        tx.value > someThreshold
      )
      
      return suspiciousTransactions.length > 0
    }

    private async getMempoolTransactions() {
      try {
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
        const pendingBlock = await provider.send("eth_getBlockByNumber", ["pending", true])
        
        return pendingBlock.transactions.map((tx: { hash: any; to: any; from: any; value: string | number | bigint | boolean; gasPrice: string | number | bigint | boolean; data: any }) => ({
          hash: tx.hash,
          to: tx.to,
          from: tx.from,
          value: BigInt(tx.value),  // ethers v6 uses native BigInt
          gasPrice: BigInt(tx.gasPrice),
          data: tx.data
        }))
      } catch (error) {
        console.error('Failed to fetch mempool:', error)
        return []
      }
    }

    private async validateFlashLoanTerms(route: ArbRoute): Promise<boolean> {
      const MAX_FLASH_LOAN_AMOUNT = ethers.parseEther("1000") // Adjust based on risk tolerance
      const MAX_FEE_PERCENTAGE = 0.09 // 0.09% max fee
      
      const loanAmount = route.flashLoanAmount
      const fee = route.flashLoanFee
      
      return loanAmount <= MAX_FLASH_LOAN_AMOUNT && 
             (fee / loanAmount) <= MAX_FEE_PERCENTAGE
    }

  
    async gatherHealthMetrics(): Promise<HealthMetrics> {
      const [liquidityScore, toxicityScore, volatilityIndex, gasCost] = await Promise.all([
        this.metricsCalculator.calculateLiquidityScore(someLiquidityDepth),  // assuming someLiquidityDepth is from a pool call
        this.metricsCalculator.calculateToxicityScore(),
        this.metricsCalculator.calculateVolatilityIndex(),
        this.metricsCalculator.estimateGasCost()
      ]);
    
      return {
        liquidityScore,
        liquidityDepth: someLiquidityDepth,  // Pass your calculated liquidity depth
        slippageImpact: await this.metricsCalculator.calculateSlippageImpact(someAmount, somePoolAddress),  // Define amount and pool address
        gasCost,
        averageGasPrice: await this.metricsCalculator.getAverageGasPrice(),
        executionSpeed: someExecutionSpeed,  // Calculate this somewhere
        averageExecutionTime: this.calculateAverageExecutionTime(),
        successRate: this.calculateSuccessRate(),
        toxicityScore,
        volatilityIndex,
        currentDrawdown: this.calculateDrawdown(),
        failureRate: 100 - this.calculateSuccessRate(),
        profitRatio: this.metricsCalculator.calculateProfitRatio(expectedProfit, gasCost, slippage),
        nodeLatency: await this.metricsCalculator.measureNodeLatency(),
        backlogSize: this.metricsCalculator.getBacklogSize(),
        lastUpdated: new Date(),
        portfolioValue: await this.metricsCalculator.getPortfolioValue()
      };
    }
    
    private async getLiquidityDepth(): Promise<number> {
      try {
        // Get liquidity across all pools in current route
        let totalLiquidity = 0
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
     
        for (const pool of this.currentPools) {
          const contract = new ethers.Contract(pool.address, poolABI, provider)
          const reserves = await contract.getReserves()
          
          // Convert reserves to USD value
          const token0USD = await this.getTokenPrice(pool.token0)
          const token1USD = await this.getTokenPrice(pool.token1)
          
          const poolLiquidity = 
            (Number(formatUnits(reserves[0], pool.token0Decimals)) * token0USD) +
            (Number(formatUnits(reserves[1], pool.token1Decimals)) * token1USD)
     
          totalLiquidity += poolLiquidity
        }
     
        return totalLiquidity
     
      } catch (error) {
        console.error('Failed to get liquidity depth:', error)
        return 0 // Fail safe - return zero liquidity
      }
     }

     private async getTokenPrice(tokenAddress: string): Promise<number> {
      try {
        // Check cache first
        const cached = this.priceCache.get(tokenAddress)
        const now = Date.now()
        
        if (cached && now - cached.timestamp < this.CACHE_DURATION) {
          return cached.price
        }
     
        const priceOracle = new ethers.Contract(
          PRICE_ORACLE_ADDRESS,
          priceOracleABI,
          this.provider
        )
        
        const price = await priceOracle.getPrice(tokenAddress)
        const priceNum = Number(formatUnits(price, 8))
        
        // Update cache
        this.priceCache.set(tokenAddress, {
          price: priceNum,
          timestamp: now
        })
     
        return priceNum
        
      } catch (error) {
        // If cache exists but is stale, return stale price rather than 0
        const staleCache = this.priceCache.get(tokenAddress)
        if (staleCache) {
          console.warn(`Using stale price for ${tokenAddress}`)
          return staleCache.price
        }
     
        console.error(`Failed to get price for token ${tokenAddress}:`, error)
        return 0
      }
     }

     private calculateAverageExecutionTime(): number {
      if (this.healthHistory.length === 0) return 0
     
      // Calculate rolling average of last 20 executions
      const recentTimes = this.healthHistory
        .slice(-20)
        .map(h => h.averageExecutionTime)
     
      return recentTimes.reduce((a, b) => a + b, 0) / recentTimes.length
     }

    private calculateSuccessRate(): number {
      if (this.healthHistory.length === 0) return 100
     
      // Look at last 100 executions
      const recentHistory = this.healthHistory.slice(-100)
      const successfulTrades = recentHistory.filter(h => 
        h.successRate > 0 && h.averageExecutionTime < this.thresholds.maxExecutionTime
      ).length
     
      return (successfulTrades / recentHistory.length) * 100
     }

    private gasPriceHistory: number[] = []

    private async getAverageGasPrice(): Promise<number> {
      try {
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
        const feeData = await provider.getFeeData() // v6 uses getFeeData() instead of getGasPrice()
        const gasPrice = feeData.gasPrice ?? 0n
        
        // Convert to Gwei 
        const gasPriceGwei = Number(formatUnits(gasPrice, "gwei"))
        
        this.gasPriceHistory = [...this.gasPriceHistory.slice(-9), gasPriceGwei]
        return this.gasPriceHistory.reduce((a, b) => a + b) / this.gasPriceHistory.length
      } catch (error) {
        console.error('Failed to get gas price:', error)
        return Infinity
      }
    }
    
    private calculateDrawdown(): number {
      if (this.healthHistory.length === 0) return 0
    
      // Get peak portfolio value from history
      const peak = Math.max(...this.healthHistory.map(h => h.portfolioValue ?? 0))
      const current = this.healthHistory[this.healthHistory.length - 1].portfolioValue ?? 0
      
      // Calculate drawdown as percentage from peak
      return peak > 0 ? ((peak - current) / peak) * 100 : 0
    }
  
    private triggerCircuitBreaker(reason: string) {
      this.isCircuitBroken = true
      console.error(`🚨 Circuit Breaker Triggered: ${reason}`)
      // Notify administrators
      this.notifyAdmins({
        type: 'CIRCUIT_BREAKER',
        reason,
        metrics: this.healthHistory[this.healthHistory.length - 1]
      })
    } 

    private async notifyAdmins(alert: { 
      type: string
      reason: string
      metrics: HealthMetrics 
    }): Promise<void> {
      try {
        // Could integrate with Discord, Telegram, or email service
        await fetch(process.env.WEBHOOK_URL!, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...alert,
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV
          })
        })
      } catch (error) {
        console.error('Failed to notify admins:', error)
      }
    }
  }