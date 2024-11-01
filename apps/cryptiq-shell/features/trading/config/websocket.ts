// File: config/websocket.ts

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