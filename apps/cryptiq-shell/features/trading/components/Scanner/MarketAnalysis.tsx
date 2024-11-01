// File: features/trading/utils/signalProcessing.ts

import { AlignedSignal, MarketDepth, PriceAnomaly, VolatilitySpike } from "../../types/marketTypes"
import { Signal } from "../../types/trading"

export interface MarketAnalysis {
    anomalies: PriceAnomaly[]
    volatility: VolatilitySpike[] 
    depth: MarketDepth
    signals: AlignedSignal[]
    orderFlow: {
      [symbol: string]: {
        price: number
        bids: Array<{ price: number; volume: number }>
        asks: Array<{ price: number; volume: number }>
        imbalance: number
        pressure: 'buy' | 'sell' | 'neutral'
      }
    }
    whaleActivity: {
      [symbol: string]: {
        price: number
        transactions: Array<{
          size: number
          side: 'buy' | 'sell'
          timestamp: number
        }>
        netFlow: number
      }
    }
    sentiment: {
      [symbol: string]: {
        price: number
        score: number // -1 to 1
        social: number
        news: number
        technical: number
      }
    }
  }