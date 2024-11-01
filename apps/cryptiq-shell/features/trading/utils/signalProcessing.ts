// File: features/trading/utils/signalProcessing.ts

import { Signal } from "../hooks/useSignalDetection"
import { PriceAnomaly, VolatilitySpike } from "../types/marketTypes"
import { MarketDepth } from "../types/marketTypes"
import { AlignedSignal } from "../types/signalTypes"

export interface PriceLevel {
    price: number
    strength: number
    signals: Signal[]
  }
  
  export interface AnalysisData {
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
    volatility: {
      [symbol: string]: {
        price: number
        current: number
        historic: number
        spikes: Array<{
          timestamp: number
          magnitude: number
        }>
      }
    }
    minStrength: number
    minConfidence: number
  }
  
  export interface MarketAnalysis {
    anomalies: PriceAnomaly[]
    volatility: VolatilitySpike[]  // This should be an array of VolatilitySpike
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
  
    
  export function determineSignalType(data: {
    orderFlow: AnalysisData['orderFlow'][string]
    sentiment: AnalysisData['sentiment'][string]
  }): 'long' | 'short' {
    // Combine order flow pressure and sentiment
    const orderFlowScore = data.orderFlow.pressure === 'buy' ? 1 : 
                          data.orderFlow.pressure === 'sell' ? -1 : 0
    
    const sentimentScore = data.sentiment.score
    
    // Weighted decision
    const compositeScore = (orderFlowScore * 0.7 + sentimentScore * 0.3)
    
    return compositeScore >= 0 ? 'long' : 'short'
  }