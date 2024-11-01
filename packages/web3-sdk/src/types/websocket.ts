// File: services/trading-service/types/websocket.ts

  export interface ArbitrageOpportunity {
    id: string
    type: string
    opportunity: string
    route: string[]
    profitUSD: number
    requiredAmount: number
    expectedSlippage: number
    confidence: number
    estimatedGas: number
    pools: {
      name: string
      liquidity: number
      utilization: number
    }[]
    expiresAt: number
  }
  
  export interface LiquidityUpdate {
    poolLiquidity: {
      [poolName: string]: number
    }
    timestamp: number
  }
  
  export type ArbitrageStreamEvent = 
    | { type: 'NEW_OPPORTUNITY'; opportunity: ArbitrageOpportunity }
    | { type: 'EXPIRED_OPPORTUNITY'; opportunityId: string }
    | { type: 'UPDATE_LIQUIDITY'; data: LiquidityUpdate }