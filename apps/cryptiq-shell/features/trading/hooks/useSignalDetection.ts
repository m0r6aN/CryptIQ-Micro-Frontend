// File: features/trading/hooks/useSignalDetection.ts

import { useState, useEffect } from 'react'
import { useMarketDataStream } from './useMarketDataStream'

export interface Signal {
  symbol: string
  strength: number
  type: 'long' | 'short'
  confidence: number
  sources: {
    orderFlow: number
    whaleActivity: number
    sentiment: number
    volatility: number
  }
  timestamp: number
}

export function useSignalDetection(config: {
  symbols: string[]
  minStrength?: number
  minConfidence?: number
}) {
  const { analysis } = useMarketDataStream({
    symbols: config.symbols,
    interval: 1000
  })

  const [signals, setSignals] = useState<Signal[]>([])
  const [hotZones, setHotZones] = useState<PriceLevel[]>([])

  useEffect(() => {
    if (!analysis) return

    // Process incoming data for signal detection
    const newSignals = detectSignals({
      orderFlow: analysis.orderFlow,
      whaleActivity: analysis.whaleActivity,
      sentiment: analysis.sentiment,
      volatility: analysis.volatility,
      minStrength: config.minStrength ?? 0.7,
      minConfidence: config.minConfidence ?? 0.8
    })

    // Find price levels with multiple signals
    const zones = findHotZones(newSignals)

    setSignals(newSignals)
    setHotZones(zones)
  }, [analysis, config.minStrength, config.minConfidence])

  return {
    signals,
    hotZones,
    activeSignals: signals.filter(s => s.strength > (config.minStrength ?? 0.7)),
    analysis
  }
}

// Signal detection utilities
function detectSignals(data: AnalysisData): Signal[] {
  const signals: Signal[] = []
  
  // Process each symbol's data
  for (const symbol of Object.keys(data.orderFlow)) {
    const orderFlowStrength = calculateOrderFlowStrength(data.orderFlow[symbol])
    const whaleStrength = calculateWhaleActivityStrength(data.whaleActivity[symbol])
    const sentimentStrength = calculateSentimentStrength(data.sentiment[symbol])
    const volatilityScore = calculateVolatilityScore(data.volatility[symbol])

    // Calculate composite signal strength
    const strength = (
      orderFlowStrength * 0.35 +
      whaleStrength * 0.25 +
      sentimentStrength * 0.2 +
      volatilityScore * 0.2
    )

    // Determine signal direction
    const type = determineSignalType({
      orderFlow: data.orderFlow[symbol],
      sentiment: data.sentiment[symbol]
    })

    if (strength >= data.minStrength) {
      signals.push({
        symbol,
        price: data.orderFlow[symbol].price,
        strength,
        type,
        confidence: calculateConfidence({
          orderFlowStrength,
          whaleStrength,
          sentimentStrength,
          volatilityScore
        }),
        sources: {
          orderFlow: orderFlowStrength,
          whaleActivity: whaleStrength,
          sentiment: sentimentStrength,
          volatility: volatilityScore
        },
        timestamp: Date.now()
      })
    }
  }

  return signals
}

function findHotZones(signals: Signal[]): PriceLevel[] {
  // Group signals by price levels within 0.5% range
  const zones = new Map<number, Signal[]>()
  
  signals.forEach(signal => {
    let assigned = false
    for (const [price, zoneSignals] of zones.entries()) {
      if (Math.abs(signal.price - price) / price < 0.005) {
        zoneSignals.push(signal)
        assigned = true
        break
      }
    }
    if (!assigned) {
      zones.set(signal.price, [signal])
    }
  })

  // Convert to array and calculate zone strength
  return Array.from(zones.entries())
    .map(([price, zoneSignals]) => ({
      price,
      strength: zoneSignals.reduce((acc, s) => acc + s.strength, 0) / zoneSignals.length,
      signals: zoneSignals
    }))
    .filter(zone => zone.signals.length > 1) // Only return zones with multiple signals
}