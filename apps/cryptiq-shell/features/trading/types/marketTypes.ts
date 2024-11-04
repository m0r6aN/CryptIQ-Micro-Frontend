// File: features/trading/types/marketTypes.ts

import { ExecutionStats } from "./executionTypes"
import { Pool, Route } from "./trading"

export interface PriceAnomaly {
    symbol: string
    price: number
    deviation: number
    timestamp: number
    direction: 'up' | 'down'
    magnitude: number
  }
  
  export interface VolatilitySpike {
    symbol: string
    timestamp: number
    magnitude: number
    price: number
    volume: number
  }

  export interface ModelData {
    type: 'MODEL_METRICS'
    metrics: {
      impactAccuracy: number
      reversalAccuracy: number
      predictionConfidence: number
      learningProgress: number
    }
  }

  export interface MarketState {
    bestRoute: Route
    pools: Pool[]
    currentPrices: Record<string, number>
    executionStats?: {
      profitLoss: number
      priceDeviation: number
      recentExecutions: ExecutionStats[]
      avgExecutionTime: number
      avgSlippage: number
      successRate: number
    }
  }
  
  
  export interface MarketDepth {
    bids: Array<{ price: number; volume: number }>
    asks: Array<{ price: number; volume: number }>
    spread: number
    timestamp: number
  }
  
  export interface AlignedSignal {
    symbol: string
    price: number    // Added this required field
    strength: number
    type: 'long' | 'short'
    timestamp: number
    sources?: {      // Optional metadata about signal sources
      anomaly?: PriceAnomaly
      spike?: VolatilitySpike
      support?: { price: number; volume: number }
    }
  }
 
  export interface WSPriceMessage {
    symbol: string
    price: number
    volume: number
    timestamp: number
  }
  
  export interface WSDepthMessage {
    message: string
    symbol: string
    bids: Array<[number, number]> // price, volume pairs
    asks: Array<[number, number]> // price, volume pairs
    timestamp: number
  }