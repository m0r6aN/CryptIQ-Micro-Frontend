import { useState, useEffect } from 'react'
import { Activity, Zap, ArrowRight, Timer, Wallet, RefreshCw } from 'lucide-react'
import { useWebSocket } from 'features/shared/hooks/useWebSocket'
import { createClient } from '@supabase/supabase-js'
import { ExchangePrice, OrderState, Pool, Route } from 'features/trading/types/trading'
import { MarketState } from 'features/trading/types/marketTypes'
import { Card, CardContent, CardTitle, CardHeader } from 'features/shared/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'features/shared/ui/select'
import { Input } from 'features/shared/ui/input'
import { Button } from 'features/shared/ui/button'
import { Badge } from 'features/shared/ui/badge'
import { ExecutionStats, SimulationParams } from 'features/trading/types/executionTypes'
import { updateExecutionStats } from 'features/trading/utils/executionUtils'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, 
                              process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function SmartExecutionInterface() {
  const [marketState, setMarketState] = useState<MarketState>({
    bestRoute: {
      path: [],
      expectedSlippage: 0,
      gasEstimate: 0,
      confidence: 0,
      estimatedProfit: 0
    },
    pools: [],
    currentPrices: {}
  })

  const [orderState, setOrderState] = useState<OrderState>({
    symbol: 'ETH-USDT',
    size: '',
    maxSlippage: 0.5,
    routingOptimization: true,
    executionSpeed: 'balanced'
  })

  const [loading, setLoading] = useState(false)

  const [selectedPool, setSelectedPool] = useState<Pool | null>(null)
  const [activeTab, setActiveTab] = useState<'execution' | 'simulation' | 'pools'>('execution')
  const [simulationParams, setSimulationParams] = useState<SimulationParams>({
    route: [],
    amount: 0,
    slippage: 0.5,
    speed: 'balanced'
  })

   // Update simulation params when route changes
   useEffect(() => {
    if (marketState.bestRoute.path.length) {
      setSimulationParams(prev => ({
        ...prev,
        route: marketState.bestRoute.path,
        amount: parseFloat(orderState.size) || 0,
        slippage: orderState.maxSlippage,
        speed: orderState.executionSpeed
      }))
    }
  }, [marketState.bestRoute, orderState])

  const handleNewExecutionStats = (stats: ExecutionStats) => {
    setMarketState(prev => ({
      ...prev,
      executionStats: updateExecutionStats(stats, prev.executionStats)
    }))
  }

  const handlePoolSelect = (pool: Pool) => {
    setSelectedPool(pool)
    // Update order state with selected pool's pair if different
    if (pool.pair !== orderState.symbol) {
      setOrderState(prev => ({ ...prev, symbol: pool.pair }))
    }
  }

  const handlePoolRefresh = async () => {
    try {
      const response = await fetch('trading-service:5000/pools/refresh')
      if (!response.ok) throw new Error('Failed to refresh pools')
      const pools = await response.json()
      handlePoolUpdate(pools)
    } catch (error) {
      console.error('Pool refresh failed:', error)
    }
  }

    // Price stream
  const { lastMessage: priceData, streamData: priceHistory } = useWebSocket<Record<string, ExchangePrice>>({
    url: `wss://trading-service:5000/price-stream/${orderState.symbol}`,
    onMessage: (message) => handlePriceUpdate(message),
    onError: (error) => console.error('Price stream error:', error)
  })

  // Pool stream
  const { lastMessage: poolData, streamData: poolHistory } = useWebSocket<Pool[]>({
    url: 'wss://trading-service:5000/pool-updates',
    onMessage: (message) => handlePoolUpdate(message),
    onError: (error) => console.error('Pool stream error:', error)
  })

  // Supabase real-time subscription for execution stats
  useEffect(() => {
    const subscription = supabase
      .channel('execution-stats')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'execution_stats'
      }, payload => {
        updateExecutionStats(payload.new)
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handlePriceUpdate = async (prices: Record<string, ExchangePrice>) => {
    setMarketState(prev => ({
      ...prev,
      currentPrices: Object.fromEntries(
        Object.entries(prices).map(([k, v]) => [k, (v.bid + v.ask) / 2])
      )
    }))

    await optimizeRoute(prices)
  }

  const handlePoolUpdate = (pools: Pool[]) => {
    setMarketState(prev => ({
      ...prev,
      pools: pools.map(pool => ({
        ...pool,
        utilization: calculatePoolUtilization(pool)
      }))
    }))
  }

  const optimizeRoute = async (prices: Record<string, ExchangePrice>) => {
    setLoading(true)
    try {
      const response = await fetch('trading-service:5000/optimize-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: orderState.symbol,
          size: orderState.size,
          prices,
          pools: marketState.pools,
          executionSpeed: orderState.executionSpeed
        })
      })

      const route: Route = await response.json()
      setMarketState(prev => ({ ...prev, bestRoute: route }))
    } catch (error) {
      console.error('Route optimization failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculatePoolUtilization = (pool: Pool): number => {
    const volume = pool.volume24h
    const liquidity = pool.liquidity
    return (volume / liquidity) * 100
  }

  const executeTrade = async () => {
    if (!marketState.bestRoute.path.length) return
    
    try {
      const execution = await fetch('trading-service:5000/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          route: marketState.bestRoute,
          orderState
        })
      })

      const result = await execution.json()
      if (!result.success) throw new Error(result.error)

      // Update Supabase with execution result
      await supabase.from('executions').insert({
        symbol: orderState.symbol,
        size: parseFloat(orderState.size),
        route: marketState.bestRoute.path,
        profit: result.profit,
        timestamp: new Date()
      })

    } catch (error) {
      console.error('Trade execution failed:', error)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Smart Trade Execution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Trading Pair</label>
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
                    <SelectItem value="SOL-USDT">SOL-USDT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Order Size</label>
                <Input 
                  type="number"
                  value={orderState.size}
                  onChange={(e) => setOrderState(prev => ({ 
                    ...prev, 
                    size: e.target.value 
                  }))}
                  placeholder="Enter size"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Max Slippage (%)</label>
                <Input 
                  type="number"
                  value={orderState.maxSlippage}
                  onChange={(e) => setOrderState(prev => ({ 
                    ...prev, 
                    maxSlippage: parseFloat(e.target.value) 
                  }))}
                  step={0.1}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Execution Priority</label>
                <Select 
                  value={orderState.executionSpeed}
                  onValueChange={(value: 'fastest' | 'balanced' | 'cheapest') => 
                    setOrderState(prev => ({ ...prev, executionSpeed: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select speed" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fastest">Fastest</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="cheapest">Cheapest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-4">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={executeTrade}
                  disabled={loading || !marketState.bestRoute.path.length}
                >
                  {loading ? 'Optimizing...' : 'Execute Trade'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Route Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-500" />
            Optimized Route
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              {marketState.bestRoute.path.map((exchange, i) => (
                <div key={exchange} className="flex items-center">
                  <Badge variant="outline" className="px-4 py-2">
                    {exchange}
                  </Badge>
                  {i < marketState.bestRoute.path.length - 1 && (
                    <ArrowRight className="h-4 w-4 mx-2" />
                  )}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">Expected Profit</p>
                <p className="text-2xl font-bold">
                  ${marketState.bestRoute.estimatedProfit.toFixed(2)}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">Slippage</p>
                <p className="text-2xl font-bold">
                  {marketState.bestRoute.expectedSlippage}%
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">Gas</p>
                <p className="text-2xl font-bold">
                  {marketState.bestRoute.gasEstimate} Gwei
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm text-muted-foreground">Confidence</p>
                <p className="text-2xl font-bold">
                  {marketState.bestRoute.confidence}%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <Button className="flex-1" variant="outline">
          <Timer className="h-4 w-4 mr-2" />
          Schedule
        </Button>
        <Button 
          className="flex-1" 
          variant="default"
          onClick={() => optimizeRoute({})}
        >
          <Activity className="h-4 w-4 mr-2" />
          Re-optimize
        </Button>
        <Button className="flex-1" variant="secondary">
          <Wallet className="h-4 w-4 mr-2" />
          Simulate
        </Button>
      </div>
    </div>
  )
}