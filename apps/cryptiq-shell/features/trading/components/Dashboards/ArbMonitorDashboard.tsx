import React from 'react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts'
import { Activity, Brain, Zap, AlertTriangle, Timer, Wallet, Network, TrendingUp, Badge } from 'lucide-react'
import { useAgentMonitoring } from 'features/trading/hooks/useAgentMonitoring'
import { Card, CardContent, CardHeader, CardTitle } from 'features/shared/ui/card'
import { Progress } from 'features/shared/ui/progress'
import { Alert, AlertTitle } from 'features/shared/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'features/shared/ui/tabs'

export function ArbMonitorDashboard() {
  const { metrics, alerts, analysis } = useAgentMonitoring()

  const AgentHealthCard = ({ agent }: { agent: any }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            <h3 className="font-medium">{agent.agentId}</h3>
          </div>
          <Badge>
            {(agent.accuracy * 100).toFixed(1)}% Accurate
          </Badge>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Confidence</span>
              <span className="text-sm">{(agent.confidence * 100).toFixed(1)}%</span>
            </div>
            <Progress value={agent.confidence * 100} />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm">Success Rate</span>
              <span className="text-sm">{(agent.successRate * 100).toFixed(1)}%</span>
            </div>
            <Progress value={agent.successRate * 100} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
              <p className="text-xs text-gray-500">Predictions</p>
              <p className="text-lg font-semibold">{agent.predictions}</p>
            </div>
            <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
              <p className="text-xs text-gray-500">Latency</p>
              <p className="text-lg font-semibold">{agent.latency}ms</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Profit</p>
                <p className="text-2xl font-bold text-green-500">
                  ${analysis.profitability.total.toLocaleString(undefined, { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2 
                  })}
                </p>
              </div>
              <Wallet className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Win Rate</p>
                <p className="text-2xl font-bold">
                  {(analysis.profitability.winRate * 100).toFixed(1)}%
                </p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Prediction Accuracy</p>
                <p className="text-2xl font-bold">
                  {(analysis.predictions.accuracy * 100).toFixed(1)}%
                </p>
              </div>
              <Brain className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Avg Profit/Trade</p>
                <p className="text-2xl font-bold">
                  ${analysis.profitability.average.toFixed(2)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
            {alerts.map((alert, i) => (
                <Alert key={i} variant={alert.severity as "default" | "info" | "warning" | "error" | null | undefined}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>{alert.title}</AlertTitle>
                  <p>{alert.message}</p>
                  <div className="flex justify-between items-center mt-2">
                    <Badge>
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </Badge>
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Agent Performance */}
      <Tabs defaultValue="agents">
        <TabsList>
          <TabsTrigger value="agents">Agent Status</TabsTrigger>
          <TabsTrigger value="trades">Trade Analysis</TabsTrigger>
          <TabsTrigger value="predictions">Prediction Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {metrics.agents.map(agent => (
              <AgentHealthCard key={agent.agentId} agent={agent} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trades">
          <Card>
            <CardContent className="pt-6">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={metrics.recentExecutions}>
                    <XAxis dataKey="timestamp" tickFormatter={tick => new Date(tick).toLocaleTimeString()} />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => `$${Number(value).toFixed(2)}`}
                      labelFormatter={(label) => new Date(label).toLocaleString()}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="profitUSD" 
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.2} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <p className="text-sm text-gray-500">Avg Gas Used</p>
                  <p className="text-lg font-bold">{analysis.efficiency.averageGasUsed.toFixed(0)}</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <p className="text-sm text-gray-500">Profit/Gas</p>
                  <p className="text-lg font-bold">${analysis.efficiency.profitPerGas.toFixed(4)}</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <p className="text-sm text-gray-500">Avg Slippage</p>
                  <p className="text-lg font-bold">{analysis.efficiency.averageSlippage.toFixed(2)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions">
          <Card>
            <CardContent className="pt-6">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <XAxis type="number" dataKey="impactPredicted" name="Predicted Impact" />
                    <YAxis type="number" dataKey="impactActual" name="Actual Impact" />
                    <Tooltip />
                    <Scatter 
                      data={metrics.recentExecutions} 
                      fill="#8b5cf6"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}