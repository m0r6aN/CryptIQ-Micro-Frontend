
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
  stopLoss?: number
  limitPrice?: number
  stopLimitPrice?: number
  currentPrice: number
  takeProfit?: number
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
}

export interface OptionOrder extends BaseOrder {
  type: 'option'
}

export interface TrailingStopOrder {
  type: string;
  symbol: string;
  currentPrice: number;
  callbackRate: number;
  activationPrice: number; // Add this line
}

export type OrderType = MarketOrder | LimitOrder | OCOOrder | TrailingStopOrder
export type OrderFormData = Partial<OrderType>

export interface Signal {
  side: any
  id?: string
  title?: string
  message: string
  type?: 'default' | 'info' | 'warning' | 'error'
  timestamp: Date
  symbol: string
  description: string
  price: number
  marketType: MarketType
  positionSide: PositionSide
  orderDirection: OrderDirection
  confidence: number
  strength: 1 | 2 | 3 | 4 | 5  // 1 = weak, 5 = strong
  expiryTime: Date
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w'
  stopLoss?: number
  takeProfit?: number[]  // Array for multiple take profit levels
  priceHistory?: number[]  // For sparkline
}

export interface PriceData {
  symbol: any  // Renamed from PriceUpdate interface
  timestamp: Date
  price: number
  volume?: number
  change?: number
  changePercent?: number
}



