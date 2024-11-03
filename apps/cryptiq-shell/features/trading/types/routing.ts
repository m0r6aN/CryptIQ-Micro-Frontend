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
  }