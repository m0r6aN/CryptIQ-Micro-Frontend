// features/arbitrage/types/protocols.ts
export enum PoolProtocol {
    Balancer = 'Balancer',
    UniswapV3 = 'UniswapV3',
    Curve = 'Curve',
    SushiSwap = 'SushiSwap',
    PancakeSwap = 'PancakeSwap',
    TraderJoe = 'TraderJoe'
  }
  
  export interface BasePool {
    id: string
    address: string
    tokens: string[]
    totalLiquidity: string
    reserves: string[]
    protocol: PoolProtocol
  }