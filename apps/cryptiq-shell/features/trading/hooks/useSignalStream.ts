// hooks/useSignalStream.ts
import { useState, useEffect, useRef, useCallback } from 'react'
import { atom, useAtom } from 'jotai'
import { Signal, PriceData } from '../types/trading'
import { useToast } from '@/hooks/use-toast'


interface SignalUpdate {
  type: 'new' | 'update' | 'expire'
  signal: Signal
  priceData?: PriceData[]
}

// Atoms for global state
const activeSignalsAtom = atom<Signal[]>([])
const priceDataAtom = atom<Record<string, PriceData[]>>({})

export function useSignalStream(symbols: string[]) {
  const [signals, setSignals] = useAtom(activeSignalsAtom)
  const [priceData, setPriceData] = useAtom(priceDataAtom)
  const [isConnected, setIsConnected] = useState(false)
  const { toast } = useToast()
  const ws = useRef<WebSocket | null>(null)
  const reconnectTimeout = useRef<NodeJS.Timeout>()

  // Price update handler
  const handlePriceUpdate = useCallback((update: PriceData) => {
    setPriceData(prev => ({
      ...prev,
      [update.symbol]: [
        ...(prev[update.symbol] || []).slice(-49),
        update
      ]
    }))
  }, [])

  // Signal update handler
  const handleSignalUpdate = useCallback((update: SignalUpdate) => {
    switch (update.type) {
      case 'new':
        setSignals(prev => [update.signal, ...prev])
        toast({
          title: 'New Signal',
          description: `${update.signal.symbol} - ${update.signal.type} ${update.signal.side}`,
          variant: 'default'
        })
        break
      case 'update':
        setSignals(prev => 
          prev.map(s => s.id === update.signal.id ? update.signal : s)
        )
        break
      case 'expire':
        setSignals(prev => prev.filter(s => s.id !== update.signal.id))
        toast({
          title: 'Signal Expired',
          description: `${update.signal.symbol} signal has expired`,
          variant: 'default'
        })
        break
    }
  }, [])

  // WebSocket connection management
  useEffect(() => {
    const connect = () => {
      ws.current = new WebSocket('wss://your-api/signals')

      ws.current.onopen = () => {
        setIsConnected(true)
        // Subscribe to symbols
        ws.current?.send(JSON.stringify({
          type: 'subscribe',
          symbols
        }))
      }

      ws.current.onclose = () => {
        setIsConnected(false)
        // Reconnect after 3 seconds
        reconnectTimeout.current = setTimeout(connect, 3000)
      }

      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.type === 'price') {
          handlePriceUpdate(data)
        } else if (data.type === 'signal') {
          handleSignalUpdate(data)
        }
      }
    }

    connect()

    return () => {
      ws.current?.close()
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current)
      }
    }
  }, [symbols])

  return {
    signals,
    priceData,
    isConnected
  }
}