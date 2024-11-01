// File: features/trading/types/heatmapTypes.ts

import { BigNumber } from 'ethers'

export interface OrderFlowLevel {
  price: number
  volume: BigNumber
  direction: 'buy' | 'sell'
  timestamp: number
  exchange: string
  depth: {
    bidVolume: BigNumber
    askVolume: BigNumber
    imbalance: number // -1 to 1, negative means more asks
  }
  trades: Array<{
    price: number
    volume: BigNumber
    side: 'buy' | 'sell'
    timestamp: number
  }>
}

export interface WhaleActivity {
  price: number
  volume: BigNumber
  type: 'buy' | 'sell'
  timestamp: number
  wallet: string
  exchange: string
  txHash: string
  confidence: number // 0 to 1
  metadata?: {
    historicalActivity?: {
      averageSize: BigNumber
      totalTrades: number
      profitLoss: number
    }
    relatedWallets?: string[]
    tags?: string[] // e.g., ['market_maker', 'institution']
  }
  impact?: {
    priceImpact: number
    volumeImpact: number
    liquidityImpact: number
  }
}

export interface SentimentLevel {
  price: number
  score: number  // -1 to 1
  timestamp: number
  sources: {
    social: number    // -1 to 1
    news: number      // -1 to 1
    technical: number // -1 to 1
    onChain: number   // -1 to 1
  }
  signals: Array<{
    type: 'bullish' | 'bearish'
    strength: number  // 0 to 1
    source: string
    description: string
  }>
  momentum: {
    shortTerm: number  // -1 to 1
    mediumTerm: number // -1 to 1
    longTerm: number   // -1 to 1
  }
  confidence: number   // 0 to 1
}

export interface HeatmapDataPoint {
  price: number
  volume: BigNumber
  intensity: number      // 0 to 1, combined signal strength
  proximity: number      // 0 to 1, distance from current price
  signals: {
    orderFlow: {
      strength: number   // 0 to 1
      direction: 'buy' | 'sell' | 'neutral'
    }
    whale: {
      strength: number   // 0 to 1
      direction: 'buy' | 'sell' | 'neutral'
      count: number     // number of whale activities at this level
    }
    sentiment: {
      strength: number   // 0 to 1
      direction: 'bullish' | 'bearish' | 'neutral'
    }
  }
  metadata: {
    lastUpdate: number
    confidence: number   // 0 to 1
    sources: string[]    // which data sources contributed
  }
}