// File: features/trading/utils/heatmapCalculations.ts

import { BigNumber } from 'ethers'
import { 
  OrderFlowLevel, 
  WhaleActivity, 
  SentimentLevel, 
  HeatmapDataPoint 
} from '../types/heatmapTypes'
import { calculateIntensity } from './calculations'

export function calculateHeatmapData(
  orderFlow: OrderFlowLevel[],
  whaleActivity: WhaleActivity[],
  sentiment: SentimentLevel[],
  priceLevel: number
): HeatmapDataPoint[] {
  return orderFlow.map(level => {
    const whaleData = whaleActivity.find(w => w.price === level.price)
    const sentimentData = sentiment.find(s => s.price === level.price)

    // Calculate signal strengths and directions
    const orderFlowSignal = calculateOrderFlowSignal(level)
    const whaleSignal = calculateWhaleSignal(whaleData)
    const sentimentSignal = calculateSentimentSignal(sentimentData)

    // Gather data sources
    const sources = []
    if (level.volume.gt(0)) sources.push('orderflow')
    if (whaleData) sources.push('whale')
    if (sentimentData) sources.push('sentiment')

    return {
      price: level.price,
      volume: level.volume,
      intensity: calculateIntensity({
        orderVolume: level.volume,
        whaleVolume: whaleData?.volume || BigNumber.from(0),
        sentiment: sentimentData?.score || 0
      }),
      proximity: Math.abs(level.price - priceLevel) / priceLevel,
      signals: {
        orderFlow: orderFlowSignal,
        whale: whaleSignal,
        sentiment: sentimentSignal
      },
      metadata: {
        lastUpdate: Date.now(),
        confidence: calculateConfidence(orderFlowSignal, whaleSignal, sentimentSignal),
        sources
      }
    }
  })
}

function calculateOrderFlowSignal(level: OrderFlowLevel): {
  strength: number
  direction: 'buy' | 'sell' | 'neutral'
} {
  const imbalance = level.depth.imbalance
  const strength = Math.abs(imbalance)
  
  return {
    strength: Math.min(strength, 1),
    direction: imbalance > 0.1 ? 'buy' : 
              imbalance < -0.1 ? 'sell' : 
              'neutral'
  }
}

function calculateWhaleSignal(whaleData?: WhaleActivity): {
  strength: number
  direction: 'buy' | 'sell' | 'neutral'
  count: number
} {
  if (!whaleData) {
    return { strength: 0, direction: 'neutral', count: 0 }
  }

  const strength = whaleData.impact?.volumeImpact || 0
  return {
    strength: Math.min(Math.abs(strength), 1),
    direction: strength > 0.1 ? 'buy' :
              strength < -0.1 ? 'sell' :
              'neutral',
    count: whaleData.metadata?.historicalActivity?.totalTrades || 0
  }
}

function calculateSentimentSignal(sentimentData?: SentimentLevel): {
  strength: number
  direction: 'bullish' | 'bearish' | 'neutral'
} {
  if (!sentimentData) {
    return { strength: 0, direction: 'neutral' }
  }

  const strength = Math.abs(sentimentData.score)
  return {
    strength: Math.min(strength, 1),
    direction: sentimentData.score > 0.1 ? 'bullish' :
              sentimentData.score < -0.1 ? 'bearish' :
              'neutral'
  }
}

function calculateConfidence(
  orderFlow: { strength: number },
  whale: { strength: number },
  sentiment: { strength: number }
): number {
  // Weight the different signals
  const weights = {
    orderFlow: 0.5,
    whale: 0.3,
    sentiment: 0.2
  }

  return Math.min(
    orderFlow.strength * weights.orderFlow +
    whale.strength * weights.whale +
    sentiment.strength * weights.sentiment,
    1
  )
}