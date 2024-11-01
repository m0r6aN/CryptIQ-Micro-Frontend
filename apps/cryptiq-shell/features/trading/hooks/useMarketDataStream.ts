// File: features/trading/hooks/useMarketDataStream.ts

import { useState, useCallback, useEffect, useRef } from 'react'
import { calculateSignalStrength } from '../utils/calculations'
import { 
  detectAnomalies, 
  detectVolatilitySpikes, 
  findNearestSupport,
  handleDepthUpdate as processDepthUpdate,
  handlePriceUpdate as processPriceUpdate
} from '../utils/marketFunctions'
import { 
  AlignedSignal, 
  MarketDepth, 
  PriceAnomaly, 
  VolatilitySpike,
  WSDepthMessage,
  WSPriceMessage
} from '../types/marketTypes'
import { useWebSocket } from '@/features/shared/hooks/useWebSocket'
import { WEBSOCKET_URLS } from '../config/websocket'

export interface MarketAnalysis {
  anomalies: PriceAnomaly[]
  volatility: VolatilitySpike[]
  depth: MarketDepth
  signals: AlignedSignal[]
}

export interface PriceHistory {
  [symbol: string]: Array<{
    price: number
    volume: number // Add volume here
    timestamp: number
  }>
}

export interface StreamConfig {
  symbols: string[]
  interval: number
  depth?: number
}

export function useMarketDataStream(config: StreamConfig) {
  const [analysis, setAnalysis] = useState<MarketAnalysis>({
    anomalies: [],
    volatility: [],
    depth: { bids: [], asks: [], spread: 0, timestamp: 0 },
    signals: []
  })

  const [connectionStatus, setConnectionStatus] = useState({
    depth: false,
    price: false
  })
  
  // Keep track of price history
  const priceHistoryRef = useRef<PriceHistory>({})

  // Handle incoming market depth data
  const onDepthMessage = useCallback((data: WSDepthMessage) => {
    try {
      const processedDepth = processDepthUpdate(data)
      setAnalysis(prev => ({
        ...prev,
        depth: processedDepth,
        signals: detectAlignedSignals({
          ...prev,
          depth: processedDepth
        })
      }))
    } catch (error) {
      console.error('Error processing depth update:', error)
    }
  }, [])

  // Handle incoming price data
  const onPriceMessage = useCallback((data: WSPriceMessage) => {
    try {
      const processedPrice = processPriceUpdate(data)
      
      // Update price history
      priceHistoryRef.current[data.symbol] = [
        ...(priceHistoryRef.current[data.symbol] || []).slice(-100), // Keep last 100 prices
        {
          price: processedPrice.price,
          volume: processedPrice.volume, // Add volume here
          timestamp: processedPrice.timestamp
        }
      ]

      // Only analyze if we have enough history
      if (priceHistoryRef.current[data.symbol].length >= 20) {
        const anomalies = detectAnomalies(priceHistoryRef.current[data.symbol])
        const volatility = detectVolatilitySpikes(priceHistoryRef.current[data.symbol])
        
        setAnalysis(prev => ({
          ...prev,
          anomalies: [
            ...prev.anomalies.filter(a => a.symbol !== data.symbol),
            ...anomalies.map(a => ({ ...a, symbol: data.symbol }))
          ],
          volatility: [
            ...prev.volatility.filter(v => v.symbol !== data.symbol),
            ...volatility.map(v => ({ ...v, symbol: data.symbol }))
          ],
          signals: detectAlignedSignals({
            ...prev,
            anomalies: [
              ...prev.anomalies.filter(a => a.symbol !== data.symbol),
              ...anomalies.map(a => ({ ...a, symbol: data.symbol }))
            ],
            volatility: [
              ...prev.volatility.filter(v => v.symbol !== data.symbol),
              ...volatility.map(v => ({ ...v, symbol: data.symbol }))
            ]
          })
        }))
      }
    } catch (error) {
      console.error('Error processing price update:', error)
    }
  }, [])

  // Connect to different data streams
  const { 
    sendMessage: sendDepthMessage,
    connected: depthConnected
  } = useWebSocket({
    url: WEBSOCKET_URLS.depth,
    onMessage: onDepthMessage,
    onOpen: () => setConnectionStatus(prev => ({ ...prev, depth: true })),
    onClose: () => setConnectionStatus(prev => ({ ...prev, depth: false })),
    onError: (error) => console.error('Depth WS Error:', error)
  })

  const { 
    sendMessage: sendPriceMessage,
    connected: priceConnected
  } = useWebSocket({
    url: WEBSOCKET_URLS.price,
    onMessage: onPriceMessage,
    onOpen: () => setConnectionStatus(prev => ({ ...prev, price: true })),
    onClose: () => setConnectionStatus(prev => ({ ...prev, price: false })),
    onError: (error) => console.error('Price WS Error:', error)
  })

  // Subscribe to market data
  const subscribe = useCallback((symbols: string[]) => {
    if (depthConnected) {
      sendDepthMessage({ type: 'subscribe', symbols })
    }
    if (priceConnected) {
      sendPriceMessage({ type: 'subscribe', symbols })
    }
  }, [sendDepthMessage, sendPriceMessage, depthConnected, priceConnected])

  // Auto-subscribe when connections are ready
  useEffect(() => {
    if (depthConnected && priceConnected) {
      subscribe(config.symbols)
    }
  }, [config.symbols, depthConnected, priceConnected, subscribe])

  // Cleanup old price history
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now()
      Object.keys(priceHistoryRef.current).forEach(symbol => {
        priceHistoryRef.current[symbol] = priceHistoryRef.current[symbol].filter(
          p => now - p.timestamp < 24 * 60 * 60 * 1000 // Keep 24 hours of data
        )
      })
    }, 60 * 60 * 1000) // Run every hour

    return () => clearInterval(cleanup)
  }, [])

  return {
    analysis,
    subscribe,
    isReady: depthConnected && priceConnected,
    connectionStatus,
    getPriceHistory: (symbol: string) => priceHistoryRef.current[symbol] || []
  }
}

function detectAlignedSignals(arg0: { anomalies: PriceAnomaly[]; volatility: VolatilitySpike[]; depth: MarketDepth; signals: AlignedSignal[] }): AlignedSignal[] {
  throw new Error('Function not implemented.')
}
