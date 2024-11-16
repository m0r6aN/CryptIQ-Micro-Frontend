// File: /hooks/use-web-socket.ts
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
  onOpen?: () => void;
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
          setState((prev: any) => ({ ...prev, isConnected: true, error: null }))
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

        const isMounted = useRef(true);
          useEffect(() => {
            return () => {
              isMounted.current = false;
            };
          }, []);

          ws.current.onerror = (event: Event) => {
            const wsError = new Error("WebSocket connection error.");
            console.error("WebSocket encountered an error:", event);
          
            // Update state within the hook
            setState((prev) => ({ ...prev, isConnected: false, error: wsError }));
          
            // Call the provided onError callback, if it exists
            onError?.(wsError);
          };
      
          ws.current.onclose = () => {
            setState((prev: any) => ({ ...prev, isConnected: false }))
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
    // Cleanup on unmount
  return () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.close()
    }
  }
}, [url, onMessage, onError, onClose, reconnectAttempts, reconnectInterval])

  // Method to send a message
  const sendMessage = useCallback((message: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message))
    } else {
      console.error('WebSocket is not open. Unable to send message.')
    }
  }, [])

  // Method to manually reconnect
  const reconnect = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.close()
      reconnectCount.current = 0 // Reset count for manual reconnection
      setState((prev: any) => ({ 
        ...prev, 
        isConnected: false, 
        error: null,
        streamData: [] // Clear stream data on manual reconnect
      }))
    }
  }

  // Method to clear stream data
  const clearStream = () => {
    setState((prev: any) => ({ ...prev, streamData: [] }))
  }

  return {
    ...state,
    sendMessage,
    reconnect,
    clearStream
  }
}