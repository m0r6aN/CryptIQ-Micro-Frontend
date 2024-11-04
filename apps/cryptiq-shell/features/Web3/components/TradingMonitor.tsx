import React, { useState, useEffect } from 'react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts'
import { Activity, Brain, Zap, AlertTriangle, Network, Timer, Wallet } from 'lucide-react'
import { useWebSocket } from 'features/shared/hooks/useWebSocket'
import { AlertType } from '../../../../../packages/web3-sdk/src/types/alert'
import { Card, CardContent, CardHeader, CardTitle } from 'features/shared/ui/card'
import { Badge } from 'features/shared/ui/badge'
import { TabsContent, TabsTrigger } from 'features/shared/ui/tabs'
import { Progress } from 'features/shared/ui/progress'
import { Alert, AlertTitle } from 'features/shared/ui/alert'
import { Button } from 'features/shared/ui/button'
import { Tabs, TabsList } from 'features/shared/ui/tabs'

interface ProfitStreamData {
  data: Array<{
    timestamp: string
    profit: number
  }>
  avgExecutionTime: number
  timingAccuracy: number
  timingData: Array<{
    timestamp: string
    optimality: number
  }>
  tradeData: Array<{
    profit: number
    impact: number
  }>
  impactData: Array<{
    timestamp: string
    predicted: number
    actual: number
  }>
}

interface ExecutionMessage {
  type: 'EXECUTION_UPDATE' | 'ALERT'
  stats?: {
    activeAgents: number
    successfulTrades: number
    failedTrades: number
    totalProfit: number
    averageSlippage: number
    gasSpent: number
  }
  alert?: AlertType
}

interface ModelMetricsData {
  type: 'MODEL_METRICS'
  metrics: {
    impactAccuracy: number
    reversalAccuracy: number
    predictionConfidence: number
    learningProgress: number
  }
}


export function TradingMonitor() {
  const { streamData: executionData, lastMessage: executionMessage } = useWebSocket<ExecutionMessage>({
    url: 'ws://trading-service:5000/execution-stream',
    onMessage: (data) => {
      console.log('New execution data:', data)
    },
    onError: (error) => {
      console.error('Execution stream error:', error)
    }
  })

  const [stats, setStats] = useState({
    activeAgents: 0,
    successfulTrades: 0,
    failedTrades: 0,
    totalProfit: 0,
    averageSlippage: 0,
    gasSpent: 0
  })

  const [modelMetrics, setModelMetrics] = useState({
    impactAccuracy: 0,
    reversalAccuracy: 0,
    predictionConfidence: 0,
    learningProgress: 0
  })

  // Model WebSocket
  const { streamData: modelData } = useWebSocket<ModelMetricsData>({
    url: 'ws://trading-service:5000/model-stream'
  })

  // Profit WebSocket
  const { streamData: profitData } = useWebSocket<ProfitStreamData>({
    url: 'ws://trading-service:5000/profit-stream'
  })

  const [alerts, setAlerts] = useState<AlertType[]>([])

    if (executionMessage?.type === 'EXECUTION_UPDATE' && executionMessage.stats) {
      setStats(prev => ({
        ...prev,
        ...executionMessage.stats
      }))
    }
    
   // Before setting the alert, check if it exists
   useEffect(() => {
    if (executionMessage?.type === 'ALERT' && executionMessage.alert) {
      setAlerts(prev => [...prev, executionMessage.alert as AlertType])
    }
  }, [executionMessage])
  
  useEffect(() => {
    const latestModelData = Array.isArray(modelData) ? modelData[0] : modelData;
    if (latestModelData?.type === 'MODEL_METRICS') {
      setModelMetrics(prev => ({
        ...prev,
        ...latestModelData.metrics
      }))
    }
  }, [modelData])

  const MetricCard = ({ title, value, icon: Icon, trend = null }: { 
    title: string, 
    value: string | number, 
    icon: React.ElementType, 
    trend?: number | null 
  }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{value}</p>
              {trend !== null && (
                <Badge variant={trend > 0 ? 'default' : 'destructive'}>
                  {trend > 0 ? '+' : ''}{trend}%
                </Badge>
              )}
            </div>
          </div>
          <Icon className="h-8 w-8 text-blue-500" />
        </div>
      </CardContent>
    </Card>
  )

  const successRate = stats.successfulTrades + stats.failedTrades === 0 
    ? 0 
    : (stats.successfulTrades / (stats.successfulTrades + stats.failedTrades) * 100)

    return (
      <div className="space-y-6">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            title="24h Profit"
            value={`$${stats.totalProfit.toLocaleString()}`}
            icon={Wallet}
            trend={12.5}
          />
          <MetricCard
            title="Success Rate"
            value={`${successRate.toFixed(1)}%`}
            icon={Activity}
            trend={3.2}
          />
          <MetricCard
            title="AI Accuracy"
            value={`${(modelMetrics.impactAccuracy * 100).toFixed(1)}%`}
            icon={Brain}
            trend={5.7}
          />
          <MetricCard
            title="Active Agents"
            value={stats.activeAgents}
            icon={Network}
          />
        </div>
  
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profit Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Profit & Loss</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={profitData[0]?.data || []}>
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.2} 
                  />
                </AreaChart>
              </ResponsiveContainer>
  
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <p className="text-sm text-gray-500">Total Trades</p>
                  <p className="text-lg font-bold">
                    {stats.successfulTrades + stats.failedTrades}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <p className="text-sm text-gray-500">Avg Slippage</p>
                  <p className="text-lg font-bold">
                    {stats.averageSlippage.toFixed(2)}%
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <p className="text-sm text-gray-500">Gas Spent</p>
                  <p className="text-lg font-bold">
                    Ξ{stats.gasSpent.toFixed(4)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
  
          {/* Model Performance */}
          <Card>
            <CardHeader>
              <CardTitle>AI Model Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Impact Prediction Accuracy</span>
                    <span>{(modelMetrics.impactAccuracy * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={modelMetrics.impactAccuracy * 100} />
                </div>
  
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Reversal Time Accuracy</span>
                    <span>{(modelMetrics.reversalAccuracy * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={modelMetrics.reversalAccuracy * 100} />
                </div>
  
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Prediction Confidence</span>
                    <span>{(modelMetrics.predictionConfidence * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={modelMetrics.predictionConfidence * 100} />
                </div>
  
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Learning Progress</span>
                    <span>{(modelMetrics.learningProgress * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={modelMetrics.learningProgress * 100} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
  
        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
            {alerts.map((alert, i) => (
                <Alert key={i} variant={alert.severity as "error" | "default" | "info" | "warning" | null | undefined}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>{alert.title}</AlertTitle>
                  <p>{alert.message}</p>
                  <div className="flex justify-between items-center mt-2">
                    <Badge variant="outline">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </Badge>
                    {alert.actionRequired && (
                      <Button size="sm" variant="outline">
                        <Zap className="h-4 w-4 mr-2" />
                        Take Action
                      </Button>
                    )}
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
  
        {/* Execution Analysis */}
        <Tabs defaultValue="trades">
          <TabsList>
            <TabsTrigger value="trades">Trade Analysis</TabsTrigger>
            <TabsTrigger value="impact">Market Impact</TabsTrigger>
            <TabsTrigger value="timing">Execution Timing</TabsTrigger>
          </TabsList>
  
          <TabsContent value="trades">
            <Card>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart>
                    <XAxis type="number" dataKey="profit" name="Profit" />
                    <YAxis type="number" dataKey="impact" name="Impact" />
                    <Tooltip />
                    <Scatter 
                      data={profitData[0]?.tradeData || []} 
                      fill="#3b82f6"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
  
          <TabsContent value="impact">
            <Card>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={profitData[0]?.impactData || []}>
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="predicted" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
  
          <TabsContent value="timing">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className="flex justify-between">
                        <span>Average Execution Time</span>
                        <Timer className="h-4 w-4" />
                      </div>
                      <p className="text-2xl font-bold mt-2">
                        {(profitData[0]?.avgExecutionTime || 0).toFixed(2)}s
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className="flex justify-between">
                        <span>Timing Accuracy</span>
                        <Activity className="h-4 w-4" />
                      </div>
                      <p className="text-2xl font-bold mt-2">
                        {(profitData[0]?.timingAccuracy || 0).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={profitData[0]?.timingData || []}>
                      <XAxis dataKey="timestamp" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="optimality" 
                        stroke="#8b5cf6" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  }