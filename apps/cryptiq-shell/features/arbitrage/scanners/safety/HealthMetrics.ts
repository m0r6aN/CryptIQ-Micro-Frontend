export interface HealthMetrics {
  // Core health indicators
  liquidityScore: number          // 0-100 indicating pool liquidity health
  liquidityDepth: number          // Total available liquidity depth
  slippageImpact: number         // Expected slippage as percentage
  
  // Cost & Performance metrics
  gasCost: number                // Estimated gas cost in base currency
  averageGasPrice: number        // Moving average of gas prices
  executionSpeed: number         // Average execution time in ms
  averageExecutionTime: number   // Rolling average execution time
  successRate: number            // Historical success rate percentage
  
  // Risk metrics
  toxicityScore: number          // 0-100 indicating potential sandwich risk
  volatilityIndex: number        // Measure of recent price volatility
  currentDrawdown: number        // Current drawdown from peak
  failureRate: number            // Historical failure rate percentage
  profitRatio: number           // Profit vs gas+slippage ratio
  portfolioValue: number
  
  // System status
  nodeLatency: number           // Network latency in ms
  backlogSize: number           // Number of pending transactions
  lastUpdated: Date             // Timestamp of last metrics update

  isCircuitBroken: boolean
}