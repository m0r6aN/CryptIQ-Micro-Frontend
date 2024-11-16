import { MarketAnalysis } from "../components/analysis/Scanner/MarketAnalysis"
import { VolatilitySpike } from "../types/marketTypes"
import { AlignedSignal } from "../types/signalTypes"
import { PriceAnomaly } from "../types/trading"

type SignalDirection = 'buy' | 'sell' | 'neutral'

type SignalOutput = {
  direction: SignalDirection
  strength: number
}

const SIGNAL_WEIGHTS = {
  orderFlowSignal: 0.3,
  whaleSignal: 0.25,
  sentimentSignal: 0.15,
  technicalSignal: 0.2,
  volumeSignal: 0.1
} as const

function detectAlignedSignals(data: MarketAnalysis): AlignedSignal[] {
  const alignedSignals: AlignedSignal[] = []

  Object.keys(data.orderFlow).forEach(symbol => {
    const orderFlow = data.orderFlow[symbol]
    const whaleData = data.whaleActivity[symbol]
    const sentiment = data.sentiment[symbol]
    const anomalies = data.anomalies.filter(a => a.symbol === symbol)
    const volatility = data.volatility.filter(v => v.symbol === symbol)

    const signals = {
      orderFlowSignal: getOrderFlowSignal(orderFlow),
      whaleSignal: getWhaleSignal(whaleData),
      sentimentSignal: getSentimentSignal(sentiment),
      technicalSignal: getTechnicalSignal({ anomalies, volatility }),
      volumeSignal: getVolumeSignal(orderFlow)
    }

    if (areSignalsAligned(signals)) {
      const strength = calculateCompositeStrength(signals)
      const direction = determineSignalDirection(signals)
      
      if (direction !== 'neutral') {
        alignedSignals.push({
          symbol,
          timestamp: Date.now(),
          price: orderFlow.price,
          type: convertDirectionToPositionType(direction),
          strength,
          sources: {
            anomaly: anomalies[0],
            spike: volatility[0],
            support: { 
              price: orderFlow.price,
              volume: calculateTotalVolume(orderFlow)
            }
          }
        })
      }
    }
  })

  return alignedSignals
}

function convertDirectionToPositionType(direction: SignalDirection): 'long' | 'short' {
  return direction === 'buy' ? 'long' : 'short'
}

function calculateTotalVolume(orderFlow: MarketAnalysis['orderFlow'][string]): number {
  return orderFlow.bids.reduce((sum, bid) => sum + bid.volume, 0) +
         orderFlow.asks.reduce((sum, ask) => sum + ask.volume, 0)
}

function getOrderFlowSignal(orderFlow: MarketAnalysis['orderFlow'][string]): SignalOutput {
  const imbalanceThreshold = 0.2
  return {
    direction: convertToSignalDirection(orderFlow.pressure),
    strength: Math.abs(orderFlow.imbalance) > imbalanceThreshold ? 
      Math.min(Math.abs(orderFlow.imbalance), 1) : 0
  }
}

function getWhaleSignal(whaleData: MarketAnalysis['whaleActivity'][string]): SignalOutput {
  const netFlowThreshold = 100
  return {
    direction: whaleData.netFlow > 0 ? 'buy' : 'sell',
    strength: Math.min(Math.abs(whaleData.netFlow) / netFlowThreshold, 1)
  }
}

function getSentimentSignal(sentiment: MarketAnalysis['sentiment'][string]): SignalOutput {
  return {
    direction: sentiment.score > 0 ? 'buy' : 'sell',
    strength: Math.abs(sentiment.score)
  }
}

function getTechnicalSignal({ 
  anomalies, 
  volatility 
}: { 
  anomalies: PriceAnomaly[], 
  volatility: VolatilitySpike[] 
}): SignalOutput {
  const hasRecentAnomaly = anomalies.some(a => Date.now() - a.timestamp < 5 * 60 * 1000)
  const hasHighVolatility = volatility.some(v => v.magnitude > 2)
  
  return {
    direction: convertToSignalDirection(anomalies[0]?.direction || 'neutral'),
    strength: hasRecentAnomaly && hasHighVolatility ? 0.8 : 0.4
  }
}

function getVolumeSignal(orderFlow: MarketAnalysis['orderFlow'][string]): SignalOutput {
  const totalVolume = calculateTotalVolume(orderFlow)
  const averageVolume = totalVolume / (orderFlow.bids.length + orderFlow.asks.length)
  
  return {
    direction: orderFlow.pressure,
    strength: Math.min(averageVolume / 1000, 1)
  }
}

function convertToSignalDirection(direction: string): SignalDirection {
  switch (direction.toLowerCase()) {
    case 'up':
    case 'long':
    case 'buy':
      return 'buy'
    case 'down':
    case 'short':
    case 'sell':
      return 'sell'
    default:
      return 'neutral'
  }
}

function areSignalsAligned(signals: Record<string, SignalOutput>): boolean {
  const directions = Object.values(signals).map(s => s.direction)
  const mainDirection = getMode(directions)
  const alignment = directions.filter(d => d === mainDirection).length / directions.length
  return alignment >= 0.6
}

function calculateCompositeStrength(signals: Record<string, SignalOutput>): number {
  return Object.entries(signals).reduce((total, [key, signal]) => {
    return total + signal.strength * SIGNAL_WEIGHTS[key as keyof typeof SIGNAL_WEIGHTS]
  }, 0)
}

function determineSignalDirection(signals: Record<string, SignalOutput>): SignalDirection {
  const directions = Object.values(signals).map(s => s.direction)
  return getMode(directions) as SignalDirection
}

function getMode(arr: string[]): string {
  return arr.sort((a, b) =>
    arr.filter(v => v === a).length - arr.filter(v => v === b).length
  ).pop() || 'neutral'
}

export {
  detectAlignedSignals,
  type SignalDirection,
  type SignalOutput
}