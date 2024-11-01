import { HeatmapDataPoint } from "../types/heatmapTypes"
import { OrderFlowLevel, SentimentLevel, WhaleActivity } from "../types/heatmapTypes"
import { SignalComponents } from "../types/signalComponents"
import { AnalysisData } from "./signalProcessing"
import { BigNumber, ethers } from 'ethers'

// features/trading/utils/calculations.ts
export function calculateRiskReward(
    entryPrice: number,
    stopLoss: number | undefined,
    takeProfit: number[] | undefined
  ): string {
    if (!stopLoss || !takeProfit?.length) return 'N/A'
  
    const risk = Math.abs(entryPrice - stopLoss)
    if (risk === 0) return 'N/A'
  
    // Calculate average reward from all take profit levels
    const rewards = takeProfit.map(tp => Math.abs(tp - entryPrice))
    const avgReward = rewards.reduce((sum, r) => sum + r, 0) / rewards.length
  
    const ratio = avgReward / risk
    return `1:${ratio.toFixed(2)}`
  }
  
  export function calculateStrength(signal: SmartFlowSignal): 1 | 2 | 3 | 4 | 5 {
    // Calculate strength based on multiple factors
    let score = 0
    
    // Add points for sentiment
    score += signal.sentiment.confidence * 2
  
    // Add points for unusual activity
    if (signal.optionsActivity.unusualActivity) score += 1
  
    // Add points for volume/OI ratio
    if (signal.optionsActivity.volumeOIRatio > 1.5) score += 1
  
    // Add points for IV percentile extremes
    if (signal.ivPercentile > 80 || signal.ivPercentile < 20) score += 1
  
    // Convert to 1-5 scale
    return Math.max(1, Math.min(5, Math.round(score))) as 1 | 2 | 3 | 4 | 5
  }
  
  export function calculateSignalStrength({
    anomaly,
    spike,
    support
  }: SignalComponents): number {
    // Initialize component scores
    const anomalyScore = anomaly 
      ? Math.min(Math.abs(anomaly.deviation) / 2, 1) 
      : 0
  
    const spikeScore = spike 
      ? Math.min(spike.magnitude / 100, 1) 
      : 0
  
    const supportScore = support 
      ? Math.min(support.volume / 1000, 1) 
      : 0
  
    // Weight the components
    const weights = {
      anomaly: 0.4,
      spike: 0.3,
      support: 0.3
    }
  
    // Calculate composite strength
    const rawStrength = 
      (anomalyScore * weights.anomaly) +
      (spikeScore * weights.spike) +
      (supportScore * weights.support)
  
    // Apply non-linear scaling to emphasize stronger signals
    const scaledStrength = Math.pow(rawStrength, 1.5)
  
    // Normalize to ensure we stay in 0-1 range
    return Math.min(scaledStrength, 1)
  }

  export function calculateOrderFlowStrength(orderFlow: AnalysisData['orderFlow'][string]): number {
    // Calculate strength based on order book imbalance and pressure
    const totalBidVolume = orderFlow.bids.reduce((sum, bid) => sum + bid.volume, 0)
    const totalAskVolume = orderFlow.asks.reduce((sum, ask) => sum + ask.volume, 0)
    
    // Calculate imbalance ratio (-1 to 1)
    const imbalance = (totalBidVolume - totalAskVolume) / (totalBidVolume + totalAskVolume)
    
    // Normalize to 0-1 range
    return (imbalance + 1) / 2
  }
  
  export function calculateWhaleActivityStrength(whaleActivity: AnalysisData['whaleActivity'][string]): number {
    // Calculate strength based on whale transaction sizes and net flow
    const totalVolume = whaleActivity.transactions.reduce((sum, tx) => sum + tx.size, 0)
    const buyVolume = whaleActivity.transactions
      .filter(tx => tx.side === 'buy')
      .reduce((sum, tx) => sum + tx.size, 0)
    
    // Calculate buy pressure (-1 to 1)
    const buyPressure = (buyVolume * 2 / totalVolume) - 1
    
    // Factor in net flow
    const netFlowNormalized = Math.tanh(whaleActivity.netFlow / 1000) // Normalize large numbers
    
    // Combine metrics
    return (Math.abs(buyPressure) * 0.7 + Math.abs(netFlowNormalized) * 0.3)
  }
  
  export function calculateSentimentStrength(sentiment: AnalysisData['sentiment'][string]): number {
    // Weighted combination of different sentiment sources
    const weights = {
      social: 0.3,
      news: 0.3,
      technical: 0.4
    }
  
    // Normalize each score to 0-1 range
    const normalizedScore = (sentiment.score + 1) / 2
    const normalizedSocial = (sentiment.social + 1) / 2
    const normalizedTechnical = (sentiment.technical + 1) / 2
  
    return (
      normalizedScore * weights.social +
      normalizedSocial * weights.news +
      normalizedTechnical * weights.technical
    )
  }
  
  export function calculateVolatilityScore(volatility: AnalysisData['volatility'][string]): number {
    // Calculate volatility score based on current vs historic volatility
    const volatilityRatio = volatility.current / volatility.historic
    
    // Count recent spikes
    const recentSpikes = volatility.spikes.filter(
      spike => Date.now() - spike.timestamp < 3600000 // Last hour
    )
  
    // Normalize spike magnitude
    const spikeScore = recentSpikes.reduce(
      (sum, spike) => sum + Math.min(spike.magnitude / 100, 1), 
      0
    ) / Math.max(recentSpikes.length, 1)
  
    // Combine metrics
    return Math.min(
      (volatilityRatio * 0.7 + spikeScore * 0.3),
      1
    )
  }
  
  export function calculateConfidence(metrics: {
    orderFlowStrength: number
    whaleStrength: number
    sentimentStrength: number
    volatilityScore: number
  }): number {
    // Weight the different components
    const weights = {
      orderFlow: 0.35,
      whale: 0.25,
      sentiment: 0.2,
      volatility: 0.2
    }
  
    // Calculate confidence score
    const confidence = 
      metrics.orderFlowStrength * weights.orderFlow +
      metrics.whaleStrength * weights.whale +
      metrics.sentimentStrength * weights.sentiment +
      metrics.volatilityScore * weights.volatility
  
    // Apply threshold curve
    return Math.pow(confidence, 1.5) // Emphasize stronger signals
  }
  
  export function calculateIntensity({
    orderVolume,
    whaleVolume,
    sentiment
  }: {
    orderVolume: BigNumber
    whaleVolume: BigNumber
    sentiment: number
  }): number {
    // Convert BigNumber volumes to numbers for calculation
    const normalizedOrderVolume = Number(ethers.utils.formatUnits(orderVolume, 6))
    const normalizedWhaleVolume = Number(ethers.utils.formatUnits(whaleVolume, 6))
  
    // Weight the components
    const orderWeight = 0.4
    const whaleWeight = 0.4
    const sentimentWeight = 0.2
  
    // Calculate weighted intensity
    return (
      (normalizedOrderVolume * orderWeight) +
      (normalizedWhaleVolume * whaleWeight) +
      (sentiment * sentimentWeight)
    )
  }