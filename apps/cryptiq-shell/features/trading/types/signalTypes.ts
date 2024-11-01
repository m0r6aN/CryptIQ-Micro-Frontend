// File: features/trading/types/signalTypes.ts

import { calculateSignalStrength } from "../utils/calculations"
import { findNearestSupport } from "../utils/marketFunctions"
import { MarketAnalysis } from "../utils/signalProcessing"
import { PriceAnomaly, VolatilitySpike } from "./marketTypes"

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
  
function detectAlignedSignals(analysis: MarketAnalysis): AlignedSignal[] {
    const signals: AlignedSignal[] = []
    
    for (const anomaly of analysis.anomalies) {
      const matchingSpike = analysis.volatility.find(
        spike => spike.symbol === anomaly.symbol
      )
      
      const depthSupport = findNearestSupport(
        analysis.depth,
        anomaly.price
      )
  
      if (matchingSpike && depthSupport) {
        signals.push({
          symbol: anomaly.symbol,
          price: anomaly.price,
          strength: calculateSignalStrength({
            anomaly,
            spike: matchingSpike,
            support: depthSupport
          }),
          type: anomaly.direction === 'up' ? 'long' : 'short',
          timestamp: Date.now(),
          sources: {
            anomaly,
            spike: matchingSpike,
            support: depthSupport
          }
        })
      }
    }
  
    return signals
  }