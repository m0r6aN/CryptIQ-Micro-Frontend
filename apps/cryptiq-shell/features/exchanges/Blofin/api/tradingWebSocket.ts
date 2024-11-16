// api/tradingWebSocket.ts

import { useWebSocket } from '@/hooks/use-web-socket'
import type { Position, Order, AccountBalance } from '../types/trading'

interface WebSocketMessage<T> {
  arg: {
    channel: string
    instId?: string
  }
  data: T[]
}

export const useTradingWebSocket = (config: {
  onPositionUpdate?: (positions: Position[]) => void
  onOrderUpdate?: (orders: Order[]) => void
  onAccountUpdate?: (balance: AccountBalance) => void
}) => {
  const wsUrl = 'wss://openapi.blofin.com/ws/private'
  
  const { sendMessage, isConnected } = useWebSocket({
    url: wsUrl,
    onMessage: (msg: WebSocketMessage<any>) => {
      switch(msg.arg.channel) {
        case 'positions':
          config.onPositionUpdate?.(msg.data)
          break
        case 'orders':
          config.onOrderUpdate?.(msg.data) 
          break
          if (msg.data.length > 0) {
            config.onAccountUpdate?.(msg.data[0]) // Access the first element
          }
          break
      }
    }
  })

  const subscribeToPositions = (instId?: string) => {
    sendMessage({
      op: 'subscribe',
      args: [{
        channel: 'positions',
        ...(instId && { instId })
      }]
    })
  }

  const subscribeToOrders = (instId?: string) => {
    sendMessage({
      op: 'subscribe', 
      args: [{
        channel: 'orders',
        ...(instId && { instId })
      }]
    })
  }

  const subscribeToAccount = () => {
    sendMessage({
      op: 'subscribe',
      args: [{
        channel: 'account'
      }]
    })
  }

  return {
    isConnected,
    subscribeToPositions,
    subscribeToOrders, 
    subscribeToAccount
  }
}