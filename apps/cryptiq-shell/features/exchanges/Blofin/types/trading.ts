// types/trading.ts

export type MarginMode = 'cross' | 'isolated'
export type OrderSide = 'buy' | 'sell' 
export type OrderType = 'market' | 'limit' | 'post_only' | 'fok' | 'ioc'
export type PositionSide = 'long' | 'short' | 'net'
export type OrderState = 'live' | 'partially_filled' | 'filled' | 'canceled'

export interface OrderRequest {
  instId: string
  marginMode: MarginMode
  positionSide: PositionSide
  side: OrderSide
  orderType?: OrderType
  price?: string
  size: string
  reduceOnly?: boolean
  clientOrderId?: string
  tpTriggerPrice?: string
  tpOrderPrice?: string 
  slTriggerPrice?: string
  slOrderPrice?: string
  brokerId?: string
}

export interface TPSLOrderRequest {
  instId: string
  marginMode: MarginMode
  positionSide: PositionSide
  side: OrderSide
  tpTriggerPrice?: string
  tpOrderPrice?: string
  slTriggerPrice?: string
  slOrderPrice?: string
  size: string
  reduceOnly?: boolean
  clientOrderId?: string
  brokerId?: string
}

export interface Position {
  positionId: string
  instId: string 
  instType: string
  marginMode: MarginMode
  positionSide: PositionSide
  positions: string
  availablePositions: string
  averagePrice: string
  margin: string
  leverage: string
  liquidationPrice: string
  unrealizedPnl: string
  unrealizedPnlRatio: string
  maintenanceMargin: string
  marginRatio: string
  createTime: string
  updateTime: string
}

export interface AccountBalance {
  totalEquity: string
  isolatedEquity: string
  details: Array<{
    currency: string
    equity: string
    balance: string
    isolatedEquity: string
    available: string
    availableEquity: string 
    frozen: string
    orderFrozen: string
    equityUsd: string
    isolatedUnrealizedPnl: string
    bonus: string
  }>
}

export interface Transfer {
  currency: string
  amount: string
  fromAccount: 'futures' | 'funding' | 'copy_trading' | 'earn' | 'spot'
  toAccount: 'futures' | 'funding' | 'copy_trading' | 'earn' | 'spot'
  clientId?: string
}

export interface Order {
  orderId: string
  clientOrderId?: string
  instId: string
  marginMode: MarginMode
  positionSide: PositionSide
  side: OrderSide
  orderType: OrderType
  price: string
  size: string
  leverage: string
  state: OrderState
  filledSize: string
  averagePrice: string
  fee: string
  pnl: string
  createTime: string
  updateTime: string
}

export interface OrderResponse {
  orderId: string
  clientOrderId?: string 
  code: string
  msg: string
}