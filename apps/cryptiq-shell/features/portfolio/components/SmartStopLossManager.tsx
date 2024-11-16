import React, { useState, useEffect } from 'react'
import { Shield, Zap, AlertTriangle } from 'lucide-react'
import { useWebSocket } from '@/hooks/use-web-socket'
import { TradingAPI } from '@/features/exchanges/Blofin/api/trading'
import { Card, CardContent, CardHeader, CardTitle } from '@/features/shared/ui/card'
import { Badge } from '@/features/shared/ui/badge'
import { Button } from '@/features/shared/ui/button'

interface StopLossConfig {
  asset: string
  entryPrice: number
  currentPrice: number
  stopPrice: number
  trailingPercent: number
  riskAmount: number
  status: 'active' | 'triggered' | 'cancelled'
}

export function SmartStopLossManager() {
  const [stopLosses, setStopLosses] = useState<StopLossConfig[]>([])
  const tradingAPI = new TradingAPI()

  // Connect to risk management service
  useWebSocket({
    url: 'ws://risk-management-service:5000/smart-stop-loss',
    onMessage: (msg: string) => {
      const update = JSON.parse(msg)
      updateStopLosses(update)
    }
  })

  // Connect to market data stream for price updates
  useWebSocket({
    url: 'ws://market-analysis-service:5000/price-stream',
    onMessage: (msg: string) => {
      const priceUpdate = JSON.parse(msg)
      adjustStopLosses(priceUpdate)
    }
  })

  const adjustStopLosses = (priceUpdate: any) => {
    setStopLosses(prev => prev.map(sl => {
      if (sl.asset !== priceUpdate.asset) return sl
      
      const newPrice = priceUpdate.price
      const priceChange = (newPrice - sl.currentPrice) / sl.currentPrice
      
      // Calculate new trailing stop if price moved up
      const newStopPrice = priceChange > 0 
        ? Math.max(sl.stopPrice, newPrice * (1 - sl.trailingPercent/100))
        : sl.stopPrice

      return {
        ...sl,
        currentPrice: newPrice,
        stopPrice: newStopPrice,
        status: newPrice <= sl.stopPrice ? 'triggered' : sl.status
      }
    }))
  }

  const updateStopLosses = (update: StopLossConfig) => {
    setStopLosses(prev => {
      const existing = prev.find(sl => sl.asset === update.asset)
      if (existing) {
        return prev.map(sl => sl.asset === update.asset ? update : sl)
      }
      return [...prev, update]
    })
  }

  const executeStopLoss = async (config: StopLossConfig) => {
    try {
      await tradingAPI.placeOrder({
        instId: config.asset,
        side: 'sell',
        orderType: 'market',
        size: config.riskAmount.toString(),
        marginMode: 'cross',
        positionSide: 'net'
      })
    } catch (error) {
      console.error('Stop loss execution failed:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Smart Stop-Loss Manager
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stopLosses.map((sl, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{sl.asset}</span>
                  <Badge variant={sl.status === 'active' ? 'success' : 
                               sl.status === 'triggered' ? 'destructive' : 'warning'}>
                    {sl.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="mt-2 space-y-1 text-sm">
                  <div>Current: ${sl.currentPrice.toFixed(2)}</div>
                  <div>Stop: ${sl.stopPrice.toFixed(2)}</div>
                  <div>Trail: {sl.trailingPercent}%</div>
                </div>
              </div>
              
              {sl.status === 'triggered' && (
                <Button 
                  variant="destructive"
                  onClick={() => executeStopLoss(sl)}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Execute Stop
                </Button>
              )}
            </div>
          ))}

          {stopLosses.length === 0 && (
            <div className="text-center text-gray-500">
              No active stop losses
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}