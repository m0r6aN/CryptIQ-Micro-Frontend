import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertTriangle, TrendingUp, Activity } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const RiskRadar = () => {
  const [riskMetrics, setRiskMetrics] = useState({
    correlationRisk: 65,
    volatilityRisk: 78,
    liquidityRisk: 45,
    marketRisk: 82,
    systemicRisk: 58
  })

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'CORRELATION_SPIKE', severity: 'high', message: 'Unusual correlation between BTC and ETH' },
    { id: 2, type: 'LIQUIDITY_DROP', severity: 'medium', message: 'Decreasing liquidity in USDT pairs' }
  ])

  // Real-time risk updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setRiskMetrics(prev => ({
        correlationRisk: prev.correlationRisk + (Math.random() - 0.5) * 10,
        volatilityRisk: prev.volatilityRisk + (Math.random() - 0.5) * 10,
        liquidityRisk: prev.liquidityRisk + (Math.random() - 0.5) * 10,
        marketRisk: prev.marketRisk + (Math.random() - 0.5) * 10,
        systemicRisk: prev.systemicRisk + (Math.random() - 0.5) * 10
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const RiskGauge = ({ value, label, color = 'blue' }) => (
    <div className="relative h-32 w-32">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="stroke-current text-gray-200"
          strokeWidth="10"
          fill="transparent"
          r="40"
          cx="50"
          cy="50"
        />
        <circle
          className={`stroke-current text-${color}-500`}
          strokeWidth="10"
          strokeLinecap="round"
          fill="transparent"
          r="40"
          cx="50"
          cy="50"
          style={{
            strokeDasharray: `${value * 2.51}, 251.2`,
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%'
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{Math.round(value)}%</span>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
    </div>
  )

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Risk Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-around gap-4">
              <RiskGauge value={riskMetrics.correlationRisk} label="Correlation" color="blue" />
              <RiskGauge value={riskMetrics.volatilityRisk} label="Volatility" color="red" />
              <RiskGauge value={riskMetrics.liquidityRisk} label="Liquidity" color="green" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map(alert => (
                <div key={alert.id} className={`p-4 rounded-lg border ${
                  alert.severity === 'high' ? 'bg-red-50 border-red-200' :
                  'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`h-4 w-4 ${
                      alert.severity === 'high' ? 'text-red-500' : 'text-yellow-500'
                    }`} />
                    <span className="font-medium">{alert.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="correlation">
        <TabsList>
          <TabsTrigger value="correlation">Correlation Matrix</TabsTrigger>
          <TabsTrigger value="liquidity">Liquidity Flow</TabsTrigger>
          <TabsTrigger value="exposure">Risk Exposure</TabsTrigger>
        </TabsList>

        <TabsContent value="correlation">
          <Card>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={generateTimeSeriesData()}>
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="btc" stroke="#f59e0b" />
                  <Line type="monotone" dataKey="eth" stroke="#3b82f6" />
                  <Line type="monotone" dataKey="sol" stroke="#10b981" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper function to generate time series data
function generateTimeSeriesData() {
  return Array.from({ length: 20 }, (_, i) => ({
    timestamp: new Date(Date.now() - (20 - i) * 1000).toISOString(),
    btc: 50 + Math.random() * 20,
    eth: 45 + Math.random() * 25,
    sol: 55 + Math.random() * 15
  }))
}

export default RiskRadar
