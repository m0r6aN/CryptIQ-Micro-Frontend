import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/features/shared/ui/card'
import { Button } from '@/features/shared/ui/button'
import { Slider } from '@/features/shared/ui/slider'
import { Badge } from '@/features/shared/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/features/shared/ui/tabs'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts'
import { Play, Pause, RotateCcw, Save, Zap, Brain, TrendingUp, DollarSign } from 'lucide-react'
import { useWebSocket } from '@/features/shared/hooks/useWebSocket'
import { PerformanceMetricProps, WebSocketHookProps } from '../types/props'

const PORTFOLIO_ENDPOINTS = {
  optimize: '/api/portfolio/optimize',
  backtest: '/api/portfolio/backtest',
  deploy: '/api/portfolio/deploy-strategy',
  metrics: '/api/portfolio/metrics',
  rebalance: '/api/portfolio/rebalance'
} as const

interface OptimizationParams {
  riskTolerance: number
  leverageMax: number
  rebalancePeriod: number
  stopLoss: number
  targetAllocation: Record<string, number>
}

interface StrategyMetrics {
  sharpe: number
  sortino: number
  maxDrawdown: number
  annualizedReturn: number
  winRate: number
  correlations: Record<string, number>
}

export default function PortfolioStrategyLab() {
  const [isBacktesting, setIsBacktesting] = useState(false)
  const [optimization, setOptimization] = useState<OptimizationParams>({
    riskTolerance: 65,
    leverageMax: 3,
    rebalancePeriod: 24,
    stopLoss: 5,
    targetAllocation: {
      BTC: 40,
      ETH: 30,
      SOL: 20,
      MATIC: 10
    }
  })

  const [metrics, setMetrics] = useState<StrategyMetrics>({
    sharpe: 0,
    sortino: 0,
    maxDrawdown: 0,
    annualizedReturn: 0,
    winRate: 0,
    correlations: {}
  })

// ... existing code ...

// Connect to portfolio service websocket
const portfolioStream = useWebSocket<WebSocketHookProps<unknown>>({
  url: 'ws://portfolio-service:5000/portfolio-stream',
  onMessage: (event) => {
    const data = JSON.parse(event.data)
    // Handle the data
  }
})

const marketStream = useWebSocket<WebSocketHookProps<unknown>>({
  url: 'ws://market-analysis-service:5000/market-stream',
  onMessage: (event) => {
    const data = JSON.parse(event.data)
    // Handle the data
  }
})
// Ensure you handle the WebSocket object directly
portfolioStream?.addEventListener('message', (event) => {
  const data = JSON.parse(event.data)
  // Handle the data
})

// ... existing code ...

  // Fetch initial metrics
  useEffect(() => {
    async function fetchMetrics() {
      const res = await fetch(PORTFOLIO_ENDPOINTS.metrics)
      const data = await res.json()
      setMetrics(data)
    }
    fetchMetrics()
  }, [])

  // Handle real-time portfolio updates
  useEffect(() => {
    if (portfolioStream?.type === 'METRICS_UPDATE') {
      setMetrics(prev => ({
        ...prev,
        ...portfolioStream.metrics
      }))
    }
  }, [portfolioStream])

  // Optimize portfolio
  const optimizePortfolio = async () => {
    try {
      const res = await fetch(PORTFOLIO_ENDPOINTS.optimize, {
        method: 'POST',
        body: JSON.stringify(optimization)
      })
      const { targetAllocation } = await res.json()
      setOptimization(prev => ({
        ...prev,
        targetAllocation
      }))
    } catch (error) {
      console.error('Optimization failed:', error)
    }
  }

  // Start/Stop backtest
  const toggleBacktest = async () => {
    if (!isBacktesting) {
      const res = await fetch(PORTFOLIO_ENDPOINTS.backtest, {
        method: 'POST',
        body: JSON.stringify(optimization)
      })
      if (res.ok) {
        setIsBacktesting(true)
      }
    } else {
      setIsBacktesting(false)
    }
  }

  // Deploy strategy
  const deployStrategy = async () => {
    try {
      await fetch(PORTFOLIO_ENDPOINTS.deploy, {
        method: 'POST',
        body: JSON.stringify(optimization)
      })
      // Strategy deployment confirmation will come through websocket
    } catch (error) {
      console.error('Strategy deployment failed:', error)
    }
  }

  const PerformanceMetric: React.FC<PerformanceMetricProps> = ({ label, value, icon: Icon, format = 'number' }) => (
    <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
      <Icon className="h-8 w-8 text-blue-500" />
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold">
          {format === 'percent' ? `${value.toFixed(1)}%` : value.toFixed(2)}
        </p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Strategy Optimization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium">Risk Tolerance</label>
                  <Slider 
                    value={[optimization.riskTolerance]}
                    onValueChange={([value]) => setOptimization(prev => ({ 
                      ...prev, 
                      riskTolerance: value 
                    }))}
                    max={100}
                    step={1}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Max Leverage</label>
                  <Slider 
                    value={[optimization.leverageMax]}
                    onValueChange={([value]) => setOptimization(prev => ({ 
                      ...prev, 
                      leverageMax: value 
                    }))}
                    max={10}
                    step={0.1}
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium">Rebalance Period (hrs)</label>
                  <Slider 
                    value={[optimization.rebalancePeriod]}
                    onValueChange={([value]) => setOptimization(prev => ({ 
                      ...prev, 
                      rebalancePeriod: value 
                    }))}
                    max={72}
                    step={1}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Stop Loss %</label>
                  <Slider 
                    value={[optimization.stopLoss]}
                    onValueChange={([value]) => setOptimization(prev => ({ 
                      ...prev, 
                      stopLoss: value 
                    }))}
                    max={20}
                    step={0.5}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <div className="flex gap-2">
                <Button onClick={toggleBacktest} variant={isBacktesting ? 'destructive' : 'default'}>
                  {isBacktesting ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                  {isBacktesting ? 'Stop' : 'Start'} Backtest
                </Button>
                <Button variant="outline" onClick={optimizePortfolio}>
                  <Brain className="mr-2 h-4 w-4" />
                  Optimize
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Save className="mr-2 h-4 w-4" />
                  Save Strategy
                </Button>
                <Button onClick={deployStrategy}>
                  <Zap className="mr-2 h-4 w-4" />
                  Deploy Live
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <PerformanceMetric 
              label="Annual Return" 
              value={metrics.annualizedReturn}
              icon={TrendingUp}
              format="percent"
            />
            <PerformanceMetric 
              label="Sharpe Ratio" 
              value={metrics.sharpe}
              icon={Brain}
            />
            <PerformanceMetric 
              label="Max Drawdown" 
              value={metrics.maxDrawdown}
              icon={DollarSign}
              format="percent"
            />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="allocation">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="allocation">Asset Allocation</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="backtest">Backtest Results</TabsTrigger>
        </TabsList>

        <TabsContent value="allocation">
          <Card>
            <CardContent className="pt-6">
              {/* Allocation Pie Chart Here */}
              <div className="grid grid-cols-4 gap-4">
                {Object.entries(optimization.targetAllocation).map(([asset, weight]) => (
                  <div key={asset} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="flex justify-between items-center">
                      <span>{asset}</span>
                      <Badge>{weight}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk">
          <Card>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart>
                  <XAxis dataKey="risk" name="Risk" />
                  <YAxis dataKey="return" name="Return" />
                  <Tooltip />
                  <Scatter 
                    name="Assets" 
                    data={Object.entries(optimization.targetAllocation).map(([asset, weight]) => ({
                      asset,
                      risk: Math.random() * 20,
                      return: Math.random() * 40 - 10,
                      size: weight
                    }))} 
                    fill="#3b82f6"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}