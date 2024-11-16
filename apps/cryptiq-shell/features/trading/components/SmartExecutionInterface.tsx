import React, { useState, useEffect } from 'react'
import { Activity, Zap, ArrowRight, Badge } from 'lucide-react'
import { useWebSocket } from '@/hooks/use-web-socket'
import { Card, CardContent, CardHeader, CardTitle } from '@/features/shared/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/features/shared/ui/select'
import { Input } from '@/features/shared/ui/input'
import { Button } from '@/features/shared/ui/button'

// Define type-safe endpoints for our trading service
const TRADING_SERVICE_ENDPOINTS = {
  analyze: '/api/trading/analyze',
  execute: '/api/trading/execute',
  optimize: '/api/trading/optimize-route'
} as const

export default function SmartTradingInterface() {
  const [orderState, setOrderState] = useState({
    symbol: 'ETH-USDT',
    size: '',
    maxSlippage: 0.5,
    routingOptimization: true,
    executionSpeed: 'balanced'
  })

  // Connect to our Python trading service websocket
  const { lastMessage, ws } = useWebSocket({ 
    url: 'ws://trading-service:5000/market-stream',
    onMessage: (message) => {
      // Handle incoming message
      console.log('Received message:', message);
    }
  })

  const marketData = lastMessage ? JSON.parse(lastMessage) : null
  const isConnected = ws !== null

  const [marketState, setMarketState] = useState({
    bestRoute: {
      path: [],
      expectedSlippage: 0,
      gasEstimate: 0,
      confidence: 0
    },
    currentPrice: 0,
    priceImpact: 0,
    liquidityScore: 0
  })

  // Fetch initial market state
  useEffect(() => {
    async function fetchMarketState() {
      const res = await fetch(TRADING_SERVICE_ENDPOINTS.analyze, {
        method: 'POST',
        body: JSON.stringify({ symbol: orderState.symbol })
      })
      const data = await res.json()
      setMarketState(data)
    }
    fetchMarketState()
  }, [orderState.symbol])

  // Update market state from websocket
  useEffect(() => {
    if (marketData) {
      setMarketState(prev => ({
        ...prev,
        currentPrice: marketData.price,
        liquidityScore: marketData.liquidity
      }))
    }
  }, [marketData])

  // Optimize route when order params change
  const optimizeRoute = async () => {
    const res = await fetch(TRADING_SERVICE_ENDPOINTS.optimize, {
      method: 'POST',
      body: JSON.stringify(orderState)
    })
    const { bestRoute } = await res.json()
    setMarketState(prev => ({ ...prev, bestRoute }))
  }

  // Execute trade
  const executeTrade = async () => {
    try {
      const res = await fetch(TRADING_SERVICE_ENDPOINTS.execute, {
        method: 'POST',
        body: JSON.stringify({
          ...orderState,
          route: marketState.bestRoute
        })
      })
      const data = await res.json()
      // Handle trade response
    } catch (error) {
      // Handle error
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Smart Trade Execution</CardTitle>
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <Select 
                value={orderState.symbol}
                onValueChange={(value) => setOrderState(prev => ({ ...prev, symbol: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select pair" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETH-USDT">ETH-USDT</SelectItem>
                  <SelectItem value="BTC-USDT">BTC-USDT</SelectItem>
                </SelectContent>
              </Select>

              <Input 
                type="number"
                value={orderState.size}
                onChange={(e) => setOrderState(prev => ({ 
                  ...prev, 
                  size: e.target.value 
                }))}
                placeholder="Enter size"
              />

              <div className="flex gap-4">
                <Button onClick={optimizeRoute}>
                  <Activity className="h-4 w-4 mr-2" />
                  Optimize Route
                </Button>
                <Button onClick={executeTrade} variant="default">
                  <Zap className="h-4 w-4 mr-2" />
                  Execute
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-500">Best Price</p>
                <p className="text-2xl font-bold">${marketState.currentPrice}</p>
              </div>
              
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-500">Liquidity Score</p>
                <p className="text-2xl font-bold">{marketState.liquidityScore}/10</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {marketState.bestRoute.path.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Optimized Route</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              {marketState.bestRoute.path.map((exchange, i) => (
                <React.Fragment key={exchange}>
                  <Badge variant="outline" className="px-4 py-2">
                    {exchange}
                  </Badge>
                  {i < marketState.bestRoute.path.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-gray-500" />
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-500">Expected Slippage</p>
                <p className="text-2xl font-bold">{marketState.bestRoute.expectedSlippage}%</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-500">Gas Estimate</p>
                <p className="text-2xl font-bold">{marketState.bestRoute.gasEstimate} Gwei</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <p className="text-sm text-gray-500">Confidence</p>
                <p className="text-2xl font-bold">{marketState.bestRoute.confidence}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}