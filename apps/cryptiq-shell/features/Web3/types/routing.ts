export interface Route {
    path: string[]
    expectedOutput: number
    estimatedGas: number
    confidence: number
    slippage: number
  }
  
  export interface Pool {
    exchange: string
    pair: string
    liquidity: number
    volume24h: number
    price: number
    fee: number
    address: string
  }
  
  export interface OrderState {
    symbol: string
    size: string
    maxSlippage: number
    routingOptimization: boolean
    executionSpeed: 'fastest' | 'balanced' | 'cheapest'
  }
  
  export interface RouteInfo {
    path: string[]
    expectedSlippage: number
    gasEstimate: number
    confidence: number
  }
  
  export interface MarketState {
    bestRoute: RouteInfo
    currentPrice: number
    priceImpact: number
    liquidityScore: number
  }
  