
// Enums/Literal Types
export type MarketType = 'spot' | 'futures' | 'options'

// Position and Order Types
export type PositionSide = 'long' | 'short'
export type OrderDirection = 'buy' | 'sell'
export type BaseOrderType = 'market' | 'limit' | 'stop' | 'takeProfit' | 'trailingStop'

// Technical Analysis Types
export type TrendDirection = 'uptrend' | 'downtrend' | 'sideways' | 'reversal_up' | 'reversal_down'
export type SignalType = 'entry' | 'exit'
export type SignalDirection = 'buy' | 'sell' | 'neutral'
export type SignalStrength = 'low' | 'medium' | 'high'

// Signal Types
export type MarketSignal = {
  direction: OrderDirection | 'neutral'
  strength: number  // 0-1 normalized value
  confidence: number  // 0-1 normalized value
}

export type TradeSignal = {
  action: 'entry' | 'exit'
  side: PositionSide
  strength: number
  metadata?: Record<string, any>
}

interface BaseOrder {
  id: string
  symbol: string
  marketType: MarketType
  positionSide: PositionSide
  orderDirection: OrderDirection
  size: number
  leverage?: number
}

export interface MarketOrder extends BaseOrder {
  type: 'market'
  price?: number // Optional since it's market price
}

export interface LimitOrder extends BaseOrder {
  type: 'limit'
  price: number
  timeInForce?: 'GTC' | 'IOC' | 'FOK'
  postOnly?: boolean
}

export interface OCOOrder extends BaseOrder {
  type: 'oco'
  price: number
  stopPrice: number
  stopLimitPrice?: number
  stopLossPrice: number
  takeProfitPrice: number
}

export interface TrailingStopOrder extends BaseOrder {
  type: 'trailing_stop'
  callbackRate: number // percentage distance from market price
  activationPrice?: number
}

export type OrderType = 'market' | 'limit' | 'oco' | 'trailing_stop'
export type Order = MarketOrder | LimitOrder | OCOOrder | TrailingStopOrder

export interface OrderFormData extends BaseOrder {
  type: OrderType
  price?: number
  stopPrice?: number
  stopLimitPrice?: number
  stopLossPrice?: number
  takeProfitPrice?: number
  callbackRate?: number
  activationPrice?: number
  timeInForce?: 'GTC' | 'IOC' | 'FOK'
  postOnly?: boolean
}

export interface PriceLevel {
  price: number
  strength: number
  signals: Signal[]
  support?: { price: number; volume: number }
  resistance?: { price: number; volume: number }
}

export interface Signal {
  id?: string
  title?: string
  message: string
  type?: 'default' | 'info' | 'warning' | 'error'
  direction: 'long' | 'short'
  timestamp: Date
  symbol: string
  description: string
  price: number
  marketType: MarketType
  positionSide: PositionSide
  orderDirection: OrderDirection
  confidence: number
  strength: 1 | 2 | 3 | 4 | 5
  expiryTime: Date
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w'
  stopLoss?: number
  takeProfit?: number[]
  priceHistory?: number[]
  // Add these useful fields from TradeSignal
  source: 'ai' | 'technical' | 'sentiment' | 'whale' | 'orderflow'
  entryType: 'entry' | 'exit'  // renamed from 'type' to avoid confusion
  metadata?: Record<string, any>
  sources: {
    orderFlow: number
    whaleActivity: number
    sentiment: number
    volatility: number
  }
}

export interface PriceData {
  symbol: any  // Renamed from PriceUpdate interface
  timestamp: Date
  price: number
  volume?: number
  change?: number
  changePercent?: number
}

export interface Trade {
  poolAddress: string
  tokenIn: string
  tokenOut: string
  amount: bigint
  minReturn: bigint
  sender: string
  recipient: string
  deadline?: number
  maxSlippage?: number
}

export interface TradeResult {

}

export interface GasOptimizer {
  getOptimalGasPrice(): Promise<bigint>
  calculateOptimalGas(): Promise<{
    gasPrice: bigint
    gasLimit: bigint
    maxFeePerGas?: bigint
    maxPriorityFeePerGas?: bigint
  }>
}

export interface PriceAnomaly {
  symbol: string
  price: number
  timestamp: number
  direction: 'up' | 'down'  // Added direction property
  magnitude: number
  deviation: number
}

// Event emitter type
export interface EventEmitter {
  emit(event: string, data: any): void
  on(event: string, handler: (data: any) => void): void
  off(event: string, handler: (data: any) => void): void
}