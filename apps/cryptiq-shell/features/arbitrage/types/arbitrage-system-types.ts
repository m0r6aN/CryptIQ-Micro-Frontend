import { JsonRpcProvider, Transaction } from 'ethers'
import { HealthMetrics } from '../scanners/safety/HealthMetrics'

export interface ArbitrageOpportunity {
  // Core identifiers
  id: number;                    // Unique identifier for this opportunity
  path: string[];                 // Token path for the arbitrage (e.g., ['ETH', 'DAI', 'USDC'])
  pools: Pool[];                  // Liquidity pools involved in the arbitrage

  // State data from pool-tracker
  expectedOutput: bigint;         // Expected output from the arbitrage
  minOutput: bigint;              // Minimum guaranteed output considering slippage
  estimatedGas: bigint;           // Estimated gas cost in the arbitrage
  priceImpact: number;            // Impact of the trade on pool prices
  
  // Risk data from SafetyManager
  riskScore: RiskScore;           // Risk score computed by the SafetyManager
  protectionStrategy?: ProtectionStrategy;  // Optional protection strategy to mitigate risks

  // Pool tracker data
  poolStats: {
    volatility: number;           // Pool volatility
    utilizationRate: number;      // Pool utilization rate
    lastUpdateTimestamp: number;  // Timestamp of the last pool state update
  };

  // Safety checks
  healthMetrics: HealthMetrics;   // Health metrics for this opportunity
  isCircuitBroken: boolean;       // Whether the circuit breaker is active
  
  // Execution context (optional)
  executionContext?: ExecutionContext; // Additional data required during execution
}

// Extend route info with SafetyManager checks
export interface RouteInfo extends Route {
  safetyChecks: {
      hasEnoughLiquidity: boolean
      isWithinSlippage: boolean
      passedSandwichCheck: boolean
      executionTimeValid: boolean
  }
}


  export interface Chain {
    id: number
    name: string
    nativeCurrency: {
      name: string
      symbol: string
      decimals: number
    }
    rpcUrls: string[]
    blockExplorerUrls: string[]
    contracts: {
      multicall: string
      v3Factory: string
      quoter: string
    }
  }
  
  
  export interface ProtectionStrategy {
    type: 'speedup' | 'reroute' | 'split' | 'abort'
    reason: string
    confidence: number
    recommendation: {
      gasPrice?: bigint
      route?: string[]
      splits?: number
      maxImpact?: number
    }
    estimatedCost: bigint
    estimatedSavings: bigint
  }
  
  export interface RiskScore {
    score: number // 0-100, lower is better
    confidence: number
    factors: {
      historicalReverts: number
      contractRisk: number
      gasRisk: number
      complexityRisk: number
    }
    recommendations: string[]
  }
  
  export interface Route {
    path: string[]
    expectedOutput: bigint
    minOutput: bigint
    estimatedGas: bigint
    priceImpact: number
    pools: Pool[]
  }
  
  export interface Pool {
    address: string
    pair: string
    liquidity: bigint
    fee: number
    utilizationRate: number
    lastTradeTimestamp: number
  }

  export type ArbRoute = {
    path: string[]
    expectedProfit: number
    requiredCapital: number
    estimatedGas: number
    confidence: number
    executionSteps: TradeStep[]
    // Add flash loan properties
    flashLoanAmount: bigint
    flashLoanFee: bigint
    flashLoanProvider: string  // e.g., 'AAVE', 'BALANCER'
    // Additional useful properties
    profitUSD: number         // Profit in USD terms
    expectedSlippage: number  // Expected slippage percentage
    minProfitUSD: number     // Minimum profit after worst-case slippage
    timestamp: number        // When route was discovered
    routeHash?: string      // Unique identifier for this route
}
  
  export interface TradeStep {
      exchange: string
      tokenIn: string
      tokenOut: string
      amount: string
      minReturn: string
      route?: string[]
    }
  
  export interface ChainAgent {
    chainId: number
    provider: JsonRpcProvider  // This is the correct v6 type
    nativeToken: string
    supportedDEXs: string[]
    gasEstimator: () => Promise<bigint>
    blockMonitor: () => void
    getLastBlock: () => Promise<number>
    waitForNextBlock: () => Promise<void>
  }
  
  export interface SandwichDetector {
    detectFrontRunning: (tx: Transaction) => Promise<boolean>
    estimateAttackProbability: (route: string[]) => Promise<number>
    suggestProtection: () => Promise<ProtectionStrategy>
    monitorMempool: () => void
    getPendingAttacks: () => Transaction[]
  }
  
  export interface BridgeMonitor {
    trackLiquidity: (bridges: string[]) => void
    estimateBridgeFees: () => Promise<bigint>
    suggestBridgeRoute: (from: Chain, to: Chain) => Promise<Route>
    getLiquidityStatus: (bridge: string) => Promise<{
      liquidity: bigint
      utilizationRate: number
      lastUpdateTimestamp: number
    }>
  }
  
  export interface RevertAnalyzer {
    analyzeHistoricalReverts: (route: string[]) => Promise<number>
    checkContractInteractions: (path: string[]) => Promise<RiskScore>
    suggestGasBuffer: () => Promise<number>
    recordExecution: (
      route: string[],
      success: boolean,
      gasUsed: bigint,
      error?: string
    ) => void
  }
  
  export interface ExecutionContext {
    route: Route
    riskScore: RiskScore
    protectionStrategy?: ProtectionStrategy
    gasPrice: bigint
    deadline: number
    slippageTolerance: number
  }
  
  export interface ExecutionResult {
    success: boolean
    gasUsed: bigint
    output: bigint
    actualImpact: number
    timestamp: number
    error?: string
  }
  
  export interface ArbitrageEvent {
    type: 'opportunity' | 'execution' | 'revert' | 'protection'
    timestamp: number
    data: {
      route?: Route
      transaction?: Transaction
      profit?: bigint
      error?: string
      protection?: ProtectionStrategy
    }
  }