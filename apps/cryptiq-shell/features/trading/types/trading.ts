
// Enums/Literal Types
export type MarketType = 'spot' | 'futures' | 'options'
export type PositionSide = 'long' | 'short'
export type OrderDirection = 'buy' | 'sell'
export type BaseOrderType = 'market' | 'limit' | 'stop' | 'takeProfit' | 'trailingStop'
export type TrendDirection = 'uptrend' | 'downtrend' | 'sideways' | 'reversal_up' | 'reversal_down'
export type SignalType = 'entry' | 'exit'
export type SignalStrength = 'low' | 'medium' | 'high'

export interface BaseOrder {
  symbol: string
  size: number
  price?: number
  marketType: MarketType
  positionSide: PositionSide
  orderDirection: OrderDirection
  leverage?: number
  reduceOnly?: boolean
}

export interface MarketOrder extends BaseOrder {
  type: 'market'
}

export interface LimitOrder extends BaseOrder {
  type: 'limit'
  price: number
}

export interface OCOOrder extends BaseOrder {
  type: 'oco'
  stopPrice: number
  limitPrice: number
  stopLimitPrice?: number
  currentPrice: number
  takeProfit?: number
}

export interface TrailingStopOrder extends BaseOrder {
  type: 'trailingStop'
  callbackRate: number  // Percentage from trigger price
}

export type OrderType = MarketOrder | LimitOrder | OCOOrder | TrailingStopOrder
export type OrderFormData = Partial<OrderType>

export interface Signal {
  symbol: string
  price: number
  marketType: MarketType
  positionSide: PositionSide
  orderDirection: OrderDirection
  confidence: number
  timestamp: Date
  strength: 1 | 2 | 3 | 4 | 5  // 1 = weak, 5 = strong
  expiryTime: Date
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w'
  stopLoss?: number
  takeProfit?: number[]  // Array for multiple take profit levels
  priceHistory?: number[]  // For sparkline
}

export interface PriceData {  // Renamed from PriceUpdate interface
  timestamp: Date
  price: number
  volume?: number
  change?: number
  changePercent?: number
}



