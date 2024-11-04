
import { ethers } from 'ethers'
import { AlertType } from '../../../../../packages/web3-sdk/src/types/alert'

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

export interface StreamData {
  data: Array<{
    timestamp: string
    profit: number
  }>
  avgExecutionTime: number
  timingAccuracy: number
  timingData: Array<{
    timestamp: string
    optimality: number
  }>
  tradeData: Array<{
    profit: number
    impact: number
  }>
  impactData: Array<{
    timestamp: string
    predicted: number
    actual: number
  }>
}

export interface ExecutionMessage {
  type: 'EXECUTION_UPDATE' | 'ALERT'
  stats?: {
    activeAgents: number
    successfulTrades: number
    failedTrades: number
    totalProfit: number
    averageSlippage: number
    gasSpent: number
  }
  alert?: AlertType
}

// Types
export interface Pool {
  exchange: string
  pair: string
  liquidity: number
  volume24h: number
}

export interface Route {
  path: string[]
  expectedSlippage: number
  gasEstimate: number
  confidence: number
  estimatedProfit: number
}

export interface OrderState {
  symbol: string
  size: string
  maxSlippage: number
  routingOptimization: boolean
  executionSpeed: 'fastest' | 'balanced' | 'cheapest'
}

export interface ExchangePrice {
  bid: number
  ask: number
  timestamp: number
}