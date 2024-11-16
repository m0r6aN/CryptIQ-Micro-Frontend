// File: features/trading/components/analysis/Scanner/MarketAnalysis.tsx
import type { MarketDepth, PriceAnomaly, VolatilitySpike } from "@/features/trading/types/marketTypes"
import type { AlignedSignal } from "@/features/trading/types/signalTypes"

export interface MarketAnalysis {
  anomalies: PriceAnomaly[]
  volatility: VolatilitySpike[] 
  depth: MarketDepth
  signals: AlignedSignal[]
  orderFlow: Record<string, {
    price: number
    bids: Array<{ price: number; volume: number }>
    asks: Array<{ price: number; volume: number }>
    imbalance: number
    pressure: 'buy' | 'sell' | 'neutral'
  }>
  whaleActivity: Record<string, {
    price: number
    transactions: Array<{
      size: number
      side: 'buy' | 'sell'
      timestamp: number
    }>
    netFlow: number
  }>
  sentiment: Record<string, {
    price: number
    score: number // -1 to 1
    social: number
    news: number
    technical: number
  }>
}