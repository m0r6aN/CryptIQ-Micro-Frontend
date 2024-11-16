// File: config/websocket.ts

import { StrategyMetrics } from "@/features/portfolio/types/strategy"

export const WEBSOCKET_URLS = {
    depth: process.env.NEXT_PUBLIC_DEPTH_WS_URL || 'wss://api.depth/stream',
    price: process.env.NEXT_PUBLIC_PRICE_WS_URL || 'wss://api.price/stream',
    trades: process.env.NEXT_PUBLIC_TRADES_WS_URL || 'wss://api.trades/stream',
    market: process.env.NEXT_PUBLIC_MARKET_WS_URL || 'wss://api.market/stream'
  } as const
  
  // Optional: Add WebSocket configuration types
  export interface WebSocketConfig {
    reconnectAttempts: number
    reconnectInterval: number // in milliseconds
    pingInterval: number // in milliseconds
    pongTimeout: number // in milliseconds
  }
  
  export const WS_CONFIG: WebSocketConfig = {
    reconnectAttempts: 5,
    reconnectInterval: 1000,
    pingInterval: 30000,
    pongTimeout: 5000
  }

  export interface WebSocketMessage<T> {
    type: string
    data: T
  }
  
  export interface MetricsUpdate {
    type: 'METRICS_UPDATE'
    metrics: Partial<StrategyMetrics>
  }
  
  export interface MarketUpdate {
    type: 'MARKET_UPDATE'
    data: {
      price: number
      volume: number
      timestamp: number
    }
  }