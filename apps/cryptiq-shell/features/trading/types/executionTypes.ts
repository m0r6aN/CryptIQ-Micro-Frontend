export interface SimulationParams {
    route: string[]
    amount: number
    slippage: number
    speed: 'fastest' | 'balanced' | 'cheapest'
    maxGas?: number
    deadline?: number
  }
  
  export interface ExecutionStats {
    id: string
    timestamp: string
    route: string[]
    amount: number
    executionPrice: number
    marketPrice: number
    slippage: number
    gasUsed: number
    profit: number
    status: 'success' | 'failure'
    executionTime: number
    priceImpact: number
    pool_id?: string
    exchange?: string
  }
  