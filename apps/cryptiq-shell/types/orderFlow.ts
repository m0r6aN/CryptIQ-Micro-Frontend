// types/orderFlow.ts
export interface OrderFlowData {
  price: number
  volume: number
  side: 'buy' | 'sell'
  aggressiveness: 'market' | 'limit'
  size: 'small' | 'medium' | 'large' | 'whale'
  timestamp: number
  exchange: string
  liquidation?: boolean
}

export interface MarketDepthLevel {
  price: number
  volume: number
  orders: number
  cumulative: number
  side: 'bid' | 'ask'
  exchanges: Array<{
    name: string
    volume: number
  }>
}

export interface OrderFlowImbalance {
  price: number
  buyVolume: number
  sellVolume: number
  ratio: number
  delta: number
}