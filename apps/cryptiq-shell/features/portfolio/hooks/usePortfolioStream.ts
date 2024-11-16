// features/portfolio/hooks/usePortfolioStream.ts
import { useState, useEffect } from 'react'
import { useWebSocket } from '@/hooks/use-web-socket'
import { PORTFOLIO_SERVICE } from '../../../api/endpoints/backend'
import type { StreamMessage } from '../types/strategy'

export function usePortfolioStream() {
  const [data, setData] = useState<StreamMessage | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const { lastMessage, sendMessage, error: wsError } = useWebSocket<StreamMessage>({
    url: PORTFOLIO_SERVICE.ws.portfolio,
    onError: (err) => setError(new Error(`WebSocket error: ${err.message}`))
  })

  useEffect(() => {
    if (lastMessage) {
      try {
        const parsed = JSON.parse(lastMessage.data)
        setData(parsed)
      } catch (err) {
        setError(new Error('Failed to parse WebSocket message'))
      }
    }
  }, [lastMessage])

  useEffect(() => {
    if (wsError) {
      onError: (wsError: { type: any }) => setError(new Error(`WebSocket error: ${wsError.type}`))
    }
  }, [wsError])

  return { data, error, sendMessage }
}