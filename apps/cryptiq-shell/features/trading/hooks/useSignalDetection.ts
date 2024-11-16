// features/trading/hooks/useSignalDetection.ts
"use client"

import { useState, useEffect } from 'react'
import { useMarketDataStream } from './useMarketDataStream'
import { detectAlignedSignals } from '../utils/signalProcessing'
import type { Signal, PriceLevel, MarketType, PositionSide, OrderDirection } from '../types/trading'
import { useToast } from '@/hooks/use-toast'
import { AlignedSignal } from '../types/signalTypes'

function convertAlignedSignalToSignal(aligned: AlignedSignal): Signal {
 return {
   id: `${aligned.symbol}-${aligned.timestamp}`,
   title: `${aligned.type.toUpperCase()} ${aligned.symbol}`,
   message: `New ${aligned.type} signal for ${aligned.symbol}`,
   type: aligned.strength > 0.8 ? 'warning' : 'info',
   direction: aligned.type,
   timestamp: new Date(aligned.timestamp),
   symbol: aligned.symbol,
   description: generateSignalDescription(aligned),
   price: aligned.price,
   marketType: 'spot' as MarketType, // Can be dynamic based on symbol
   positionSide: aligned.type as PositionSide,
   orderDirection: aligned.type === 'long' ? 'buy' as OrderDirection : 'sell' as OrderDirection,
   confidence: calculateSignalConfidence(aligned),
   strength: convertStrengthToScale(aligned.strength),
   expiryTime: new Date(aligned.timestamp + 30 * 60 * 1000), // 30 min expiry
   timeframe: determineTimeframe(aligned),
   stopLoss: calculateStopLoss(aligned),
   takeProfit: calculateTakeProfitLevels(aligned),
   sources: aligned.sources ? {
     orderFlow: 0.8,
     whaleActivity: aligned.sources.anomaly ? 0.9 : 0.5,
     sentiment: 0.7,
     volatility: aligned.sources.spike ? 0.85 : 0.6
   } : {
     orderFlow: 0.7,
     whaleActivity: 0.6,
     sentiment: 0.7,
     volatility: 0.6
   }
 }
}

function generateSignalDescription(signal: AlignedSignal): string {
 const strength = signal.strength > 0.8 ? 'Strong' : signal.strength > 0.6 ? 'Moderate' : 'Weak'
 const direction = signal.type === 'long' ? 'bullish' : 'bearish'
 const evidence = []
 
 if (signal.sources?.anomaly) evidence.push('price anomaly')
 if (signal.sources?.spike) evidence.push('volatility spike')
 if (signal.sources?.support) evidence.push('key support level')
 
 return `${strength} ${direction} signal detected${evidence.length ? ` with ${evidence.join(', ')}` : ''}`
}

function calculateSignalConfidence(signal: AlignedSignal): number {
 let confidence = signal.strength * 0.7 // Base confidence from strength
 
 // Add confidence based on supporting evidence
 if (signal.sources?.anomaly) confidence += 0.1
 if (signal.sources?.spike) confidence += 0.1
 if (signal.sources?.support) confidence += 0.1
 
 return Math.min(confidence, 1)
}

function convertStrengthToScale(strength: number): 1 | 2 | 3 | 4 | 5 {
 if (strength > 0.9) return 5
 if (strength > 0.8) return 4
 if (strength > 0.7) return 3
 if (strength > 0.6) return 2
 return 1
}

function determineTimeframe(signal: AlignedSignal): Signal['timeframe'] {
 // Could be more sophisticated based on signal characteristics
 return '15m'
}

function calculateStopLoss(signal: AlignedSignal): number {
 // Basic implementation - could be more sophisticated
 const stopDistance = signal.price * 0.02 // 2% stop loss
 return signal.type === 'long' ? 
   signal.price - stopDistance : 
   signal.price + stopDistance
}

function calculateTakeProfitLevels(signal: AlignedSignal): number[] {
 // Multiple take profit levels
 const tp1 = signal.price * (signal.type === 'long' ? 1.03 : 0.97)
 const tp2 = signal.price * (signal.type === 'long' ? 1.05 : 0.95)
 const tp3 = signal.price * (signal.type === 'long' ? 1.08 : 0.92)
 return [tp1, tp2, tp3]
}

function findHotZones(signals: Signal[]): PriceLevel[] {
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

 return Array.from(zones.entries())
   .map(([price, zoneSignals]) => ({
     price,
     strength: zoneSignals.reduce((acc, s) => acc + (s.strength / 5), 0) / zoneSignals.length,
     signals: zoneSignals
   }))
   .filter(zone => zone.signals.length > 1)
}

export function useSignalDetection(config: {
 symbols: string[]
 minStrength?: number
 minConfidence?: number
}) {
 const { analysis, isReady } = useMarketDataStream({
   symbols: config.symbols,
   interval: 1000
 })
 const { toast } = useToast()
 const [signals, setSignals] = useState<Signal[]>([])
 const [hotZones, setHotZones] = useState<PriceLevel[]>([])

 useEffect(() => {
   if (!analysis || !isReady) return

   const alignedSignals = detectAlignedSignals(analysis)
   const newSignals = alignedSignals
     .filter(signal => 
       signal.strength >= (config.minStrength ?? 0.7))
     .map(convertAlignedSignalToSignal)
     .filter(signal => signal.confidence >= (config.minConfidence ?? 0.7))

   if (newSignals.length > signals.length) {
     toast({
       title: 'New Trading Signals',
       description: `${newSignals.length - signals.length} new signals detected`,
       variant: 'default'
     })
   }

   setSignals(newSignals)
   setHotZones(findHotZones(newSignals))
 }, [analysis, config.minStrength, config.minConfidence, isReady, signals.length, toast])

 return {
   signals,
   hotZones,
   activeSignals: signals.filter(s => s.strength >= 3),
   analysis,
   isReady
 }
}