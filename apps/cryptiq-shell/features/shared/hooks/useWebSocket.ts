// features/shared/hooks/useWebSocket.ts
import { useEffect, useRef } from 'react'

interface WebSocketHookProps<T> {
  url: string
  onMessage: (data: T) => void
  onError?: (error: Event) => void
  onClose?: (event: CloseEvent) => void
}

export function useWebSocket<T>({ url, onMessage, onError, onClose }: WebSocketHookProps<T>) {
  const ws = useRef<WebSocket | null>(null)

  useEffect(() => {
    ws.current = new WebSocket(url)

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as T
        onMessage(data)
      } catch (error) {
        console.error('WebSocket message parsing error:', error)
      }
    }

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error)
      onError?.(error)
    }

    ws.current.onclose = (event) => {
      console.log('WebSocket closed:', event)
      onClose?.(event)
    }

    return () => {
      ws.current?.close()
    }
  }, [url, onMessage, onError, onClose])

  return ws.current
}