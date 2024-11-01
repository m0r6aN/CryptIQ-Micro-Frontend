// File: features/trading/utils/marketFunctions.ts

import { PriceAnomaly, VolatilitySpike, MarketDepth, AlignedSignal, WSPriceMessage, WSDepthMessage } from '../types/marketTypes'

export function detectAnomalies(data: Array<{ price: number; timestamp: number }>): PriceAnomaly[] {
  const anomalies: PriceAnomaly[] = []
  const window = 20 // Rolling window size

  for (let i = window; i < data.length; i++) {
    const slice = data.slice(i - window, i)
    const mean = slice.reduce((sum, p) => sum + p.price, 0) / window
    const std = Math.sqrt(
      slice.reduce((sum, p) => sum + Math.pow(p.price - mean, 2), 0) / window
    )

    const currentPrice = data[i].price
    const deviation = (currentPrice - mean) / std

    if (Math.abs(deviation) > 2) { // Z-score threshold
      anomalies.push({
        symbol: 'PLACEHOLDER', // Replace with actual symbol
        price: currentPrice,
        deviation,
        timestamp: data[i].timestamp,
        direction: currentPrice > mean ? 'up' : 'down',
        magnitude: Math.abs(deviation)
      })
    }
  }

  return anomalies
}

export function detectVolatilitySpikes(
  data: Array<{ price: number; volume: number; timestamp: number }>
): VolatilitySpike[] {
  const spikes: VolatilitySpike[] = []
  const window = 10 // Rolling window size

  for (let i = window; i < data.length; i++) {
    const slice = data.slice(i - window, i)
    const returns = slice.map((d, idx) => 
      idx > 0 ? Math.log(d.price / slice[idx - 1].price) : 0
    )
    
    const volatility = Math.sqrt(
      returns.reduce((sum, r) => sum + r * r, 0) / (window - 1)
    ) * Math.sqrt(252) // Annualized

    const currentVol = Math.abs(
      Math.log(data[i].price / data[i-1].price)
    ) * Math.sqrt(252)

    if (currentVol > volatility * 2) { // Spike threshold
      spikes.push({
        symbol: 'PLACEHOLDER', // Replace with actual symbol
        timestamp: data[i].timestamp,
        magnitude: currentVol / volatility,
        price: data[i].price,
        volume: data[i].volume
      })
    }
  }

  return spikes
}

// Update the findNearestSupport function
export function findNearestSupport(
  depth: MarketDepth,
  price: number
): { price: number; volume: number } | null {
  const significantLevels = depth.bids
    .filter(bid => bid.volume > depth.bids.reduce((sum, b) => sum + b.volume, 0) / depth.bids.length)
    .sort((a, b) => b.volume - a.volume)

  return significantLevels.find(level => level.price < price) || null
}

export function handleDepthUpdate(
message: WSDepthMessage): MarketDepth {
 const bids = message.bids
 const asks = message.asks
  
  // Calculate cumulative totals
  const processedBids = bids.map((bid: [number, number], index: number) => ({
    price: bid[0],
    volume: bid[1],
    total: bids.slice(0, index + 1).reduce((sum: number, b: [number, number]) => sum + b[1], 0)
  }))

  const processedAsks = asks.map((ask: [number, number], index: number) => ({
    price: ask[0],
    volume: ask[1],
    total: asks.slice(0, index + 1).reduce((sum: number, a: [number, number]) => sum + a[1], 0)
  }))

  return {
    bids: processedBids,
    asks: processedAsks,
    spread: processedAsks[0].price - processedBids[0].price,
    timestamp: Date.now()
  }
}

export function handlePriceUpdate(
  message: WSPriceMessage
): { price: number; volume: number; timestamp: number } {
  return {
    price: message.price,
    volume: message.volume || 0,
    timestamp: message.timestamp || Date.now()
  }
}

export function sendMessage(socket: WebSocket, message: any): void {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message))
  }
}

export function processPriceUpdate(message: WSPriceMessage): {
  price: number
  volume: number
  timestamp: number
} {
  return {
    price: message.price,
    volume: message.volume,
    timestamp: message.timestamp
  }
}

export function processDepthUpdate(message: WSDepthMessage): MarketDepth {
  const bids = message.bids.map(([price, volume]) => ({ price, volume }))
  const asks = message.asks.map(([price, volume]) => ({ price, volume }))
  
  return {
    bids,
    asks,
    spread: asks[0]?.price - bids[0]?.price || 0,
    timestamp: message.timestamp
  }
}

