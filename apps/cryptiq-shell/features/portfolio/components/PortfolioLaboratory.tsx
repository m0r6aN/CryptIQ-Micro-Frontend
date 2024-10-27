import React, { useState } from 'react'

import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts'
import { Play, Pause, RotateCcw, Save, Zap, Brain, TrendingUp, DollarSign, Percent } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/features/shared/ui/card'
import { Slider } from '@/features/shared/ui/slider'
import { Button } from '@/features/shared/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/features/shared/ui/tabs'

const StrategyLab = () => {
  const [isBacktesting, setIsBacktesting] = useState(false)
  const [optimization, setOptimization] = useState({
    riskTolerance: 65,
    leverageMax: 3,
    rebalancePeriod: 24,
    stopLoss: 5
  })

  const [performance, setPerformance] = useState({
    sharpe: 2.8,
    sortino: 3.1,
    maxDrawdown: -15.4,
    annualizedReturn: 42.6,
    winRate: 68.5
  })

  const toggleBacktest = () => {
    setIsBacktesting(!isBacktesting)
    // Simulate strategy execution
    if (!isBacktesting) {
      simulateTrading()
    }
  }

  const simulateTrading = () => {
    // Fancy animation effect for the charts
    const interval = setInterval(() => {
      setPerformance(prev => ({
        ...prev,
        annualizedReturn: prev.annualizedReturn + (Math.random() - 0.5) * 2,
        maxDrawdown: prev.maxDrawdown + (Math.random() - 0.5),
        winRate: Math.min(100, prev.winRate + (Math.random() - 0.5))
      }))
    }, 1000)

    return () => clearInterval(interval)
  }

  const PerformanceMetric = ({ label, value, icon: Icon, format = 'number' }) => (
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
    <div className="space-y-4">
      {/* Strategy Control Panel */}
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
                    onValueChange={([value]) => setOptimization(prev => ({ ...prev, riskTolerance: value }))}
                    max={100}
                    step={1}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Max Leverage</label>
                  <Slider 
                    value={[optimization.leverageMax]}
                    onValueChange={([value]) => setOptimization(prev => ({ ...prev, leverageMax: value }))}
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
                    onValueChange={([value]) => setOptimization(prev => ({ ...prev, rebalancePeriod: value }))}
                    max={72}
                    step={1}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Stop Loss %</label>
                  <Slider 
                    value={[optimization.stopLoss]}
                    onValueChange={([value]) => setOptimization(prev => ({ ...prev, stopLoss: value }))}
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
                <Button variant="outline">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Save className="mr-2 h-4 w-4" />
                  Save Strategy
                </Button>
                <Button>
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
              value={performance.annualizedReturn}
              icon={TrendingUp}
              format="percent"
            />
            <PerformanceMetric 
              label="Sharpe Ratio" 
              value={performance.sharpe}
              icon={Brain}
            />
            <PerformanceMetric 
              label="Max Drawdown" 
              value={performance.maxDrawdown}
              icon={DollarSign}
              format="percent"
            />
            <PerformanceMetric 
              label="Win Rate" 
              value={performance.winRate}
              icon={Percent}
              format="percent"
            />
          </CardContent>
        </Card>
      </div>

      {/* Strategy Analysis Tabs */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
          <TabsTrigger value="allocation">Asset Allocation</TabsTrigger>
          <TabsTrigger value="optimization">AI Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="performance">
          <Card>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={generatePerformanceData()}>
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#2563eb" 
                    fill="#3b82f6" 
                    fillOpacity={0.2} 
                  />
                </AreaChart>
              </ResponsiveContainer>
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
                    data={generateRiskReturnData()} 
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

// Helper functions for generating sample data
function generatePerformanceData() {
  return Array.from({ length: 100 }, (_, i) => ({
    timestamp: new Date(Date.now() - (100 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    value: 1000 * Math.exp(0.001 * i + Math.sin(i / 10) * 0.1)
  }))
}

function generateRiskReturnData() {
  return Array.from({ length: 50 }, () => ({
    risk: Math.random() * 20,
    return: Math.random() * 40 - 10,
    size: Math.random() * 100
  }))
}

export default StrategyLab