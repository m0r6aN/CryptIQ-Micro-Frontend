// File: features/shared/hooks/useWebSocket.ts

import { useState, useCallback, useEffect, useRef } from "react"

export interface WebSocketConfig<T> {
  url: string
  onMessage?: (message: T) => void
  onError?: (error: Event) => void
  onClose?: (event: CloseEvent) => void
  onOpen?: (event: Event) => void
  reconnectAttempts?: number
  reconnectInterval?: number
}

export interface WebSocketHookReturn {
  sendMessage: (message: any) => void
  readyState: number
  connecting: boolean
  connected: boolean
  lastMessage: any
}

export interface WebSocketMessage<T = any> {
  type: string
  data: T
}

export interface WebSocketOptions<T> {
  url: string
  onMessage?: (data: T) => void
  onError?: (error: Error) => void
  onClose?: () => void
  reconnectAttempts?: number
  reconnectInterval?: number
}

export interface WebSocketState<T> {
  isConnected: boolean
  error: Error | null
  streamData: T[]
  lastMessage: T | null
}


export function useWebSocket<T>({ 
  url, 
  onMessage, 
  onError, 
  onClose,
  reconnectAttempts = 3,
  reconnectInterval = 5000
}: WebSocketOptions<T>) {
  const [state, setState] = useState<WebSocketState<T>>({
    isConnected: false,
    error: null,
    streamData: [],
    lastMessage: null
  })

  const ws = useRef<WebSocket | null>(null)
  const reconnectCount = useRef(0)

  useEffect(() => {
    const connect = () => {
      try {
        ws.current = new WebSocket(url)

        ws.current.onopen = () => {
          setState(prev => ({ ...prev, isConnected: true, error: null }))
          reconnectCount.current = 0 // Reset count on successful connection
        }

        ws.current.onmessage = (event: { data: string }) => {
          try {
            const message: WebSocketMessage<T> = JSON.parse(event.data)
            
            setState(prev => ({
              ...prev,
              streamData: [...prev.streamData, message.data],
              lastMessage: message.data
            }))

            // Call custom message handler if provided
            onMessage?.(message.data)
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error)
          }
        }

        ws.current.onerror = (error: any) => {
          const wsError = new Error(`WebSocket error: ${error}`)
          setState(prev => ({ ...prev, error: wsError }))
          onError?.(wsError)
        }

        ws.current.onclose = () => {
          setState(prev => ({ ...prev, isConnected: false }))
          onClose?.()

          // Attempt reconnection if within limits
          if (reconnectCount.current < reconnectAttempts) {
            reconnectCount.current++
            setTimeout(connect, reconnectInterval)
          }
        }
      } catch (error) {
        console.error('WebSocket connection failed:', error)
      }
    }

    connect()

    // Cleanup on unmount
    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [url, onMessage, onError, onClose, reconnectAttempts, reconnectInterval])

  // Method to manually reconnect
  const reconnect = () => {
    if (ws.current) {
      ws.current.close()
      reconnectCount.current = 0 // Reset count for manual reconnection
      setState(prev => ({ 
        ...prev, 
        isConnected: false, 
        error: null,
        streamData: [] // Clear stream data on manual reconnect
      }))
    }
  }

  // Method to clear stream data
  const clearStream = () => {
    setState(prev => ({ ...prev, streamData: [] }))
  }

  return {
    ...state,
    reconnect,
    clearStream
  }
}