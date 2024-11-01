import { useState, useEffect, useCallback } from 'react'

interface WebSocketConfig {
  url: string
  onMessage?: (message: any) => void
  onError?: (error: Event) => void
  onClose?: (event: CloseEvent) => void
  onOpen?: (event: Event) => void
  reconnectAttempts?: number
  reconnectInterval?: number
}

interface WebSocketHookReturn {
  lastMessage: any
  sendMessage: (message: any) => void
  readyState: number
  connecting: boolean
}

export function useWebSocket(config: WebSocketConfig): WebSocketHookReturn {
  const [lastMessage, setLastMessage] = useState<any>(null)
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [readyState, setReadyState] = useState<number>(WebSocket.CLOSED)

  const connect = useCallback(() => {
    try {
      setConnecting(true)
      const ws = new WebSocket(config.url)

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        setLastMessage(data)
        config.onMessage?.(data)
      }

      ws.onopen = (event) => {
        setConnecting(false)
        setReadyState(ws.readyState)
        config.onOpen?.(event)
      }

      ws.onclose = (event) => {
        setConnecting(false)
        setReadyState(ws.readyState)
        config.onClose?.(event)
      }

      ws.onerror = (event) => {
        setConnecting(false)
        config.onError?.(event)
      }

      setSocket(ws)
    } catch (error) {
      setConnecting(false)
      console.error('WebSocket connection error:', error)
    }
  }, [config])

  useEffect(() => {
    connect()
    return () => {
      if (socket) {
        socket.close()
      }
    }
  }, [connect])

  const sendMessage = useCallback((message: any) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message))
    }
  }, [socket])

  return {
    lastMessage,
    sendMessage,
    readyState,
    connecting
  }
}
