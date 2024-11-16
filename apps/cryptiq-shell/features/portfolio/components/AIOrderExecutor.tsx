import React, { useState } from 'react'
import { Brain, Zap, AlertTriangle, CheckCircle } from 'lucide-react'
import { useWebSocket } from '@/hooks/use-web-socket'
import { TradingAPI } from '@/features/exchanges/Blofin/api/trading'
import { Card, CardContent, CardHeader, CardTitle } from '@/features/shared/ui/card'
import { Badge } from '@/features/shared/ui/badge'
import { Button } from '@/features/shared/ui/button'


interface ExecutionSignal {
  asset: string
  side: 'buy' | 'sell'
  size: number
  type: 'market' | 'limit'
  price?: number
  confidence: number
  reasons: string[]
}

export function AIOrderExecutor() {
  const [pendingSignals, setPendingSignals] = useState<ExecutionSignal[]>([])
  const [executingOrders, setExecutingOrders] = useState<Set<string>>(new Set())
  const tradingAPI = new TradingAPI()

  useWebSocket({
    url: 'ws://market-analysis-service:5000/trading-signals',
    onMessage: (msg) => {
      try {
        const signal = JSON.parse(msg as string)
        setPendingSignals(prev => [...prev, signal])
      } catch (error) {
        console.error('Failed to parse message:', error)
      }
    }
  })

  const executeOrder = async (signal: ExecutionSignal) => {
    const orderId = `${signal.asset}-${Date.now()}`
    setExecutingOrders(prev => new Set(prev).add(orderId))
    
    try {
      await tradingAPI.placeOrder({
        instId: signal.asset,
        side: signal.side,
        orderType: signal.type,
        price: signal.price?.toString(),
        size: signal.size.toString(),
        marginMode: 'cross',
        positionSide: 'net'
      })

      setPendingSignals(prev => 
        prev.filter(s => s !== signal)
      )
    } catch (error) {
      console.error('Order execution failed:', error)
    } finally {
      setExecutingOrders(prev => {
        const next = new Set(prev)
        next.delete(orderId)
        return next
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          AI Trading Signals
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingSignals.map((signal, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{signal.asset}</span>
                  <Badge variant={signal.side === 'buy' ? 'success' : 'destructive'}>
                    {signal.side.toUpperCase()}
                  </Badge>
                  <Badge variant="outline">
                    Confidence: {signal.confidence}%
                  </Badge>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  {signal.reasons[0]}
                </div>
              </div>
              
              <Button 
                onClick={() => executeOrder(signal)}
                disabled={executingOrders.has(`${signal.asset}-${Date.now()}`)}
              >
                <Zap className="w-4 h-4 mr-2" />
                Execute
              </Button>
            </div>
          ))}

          {pendingSignals.length === 0 && (
            <div className="text-center text-gray-500">
              No active trading signals
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}