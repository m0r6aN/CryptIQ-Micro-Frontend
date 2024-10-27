import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/features/shared/ui/card'
import { Button } from '@/features/shared/ui/button'
import { Badge } from '@/features/shared/ui/badge'
import { Progress } from '@/features/shared/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/features/shared/ui/tabs'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { AlertTriangle, TrendingUp, Activity } from 'lucide-react'
import { useWebSocket } from '@/features/shared/hooks/useWebSocket'

const RISK_SERVICE_ENDPOINTS = {
  metrics: '/api/risk/metrics',
  alerts: '/api/risk/alerts',
  sentiment: '/api/sentiment/analysis'
} as const

export default function RiskRadar() {
  const [riskMetrics, setRiskMetrics] = useState({
    correlationRisk: 0,
    volatilityRisk: 0,
    liquidityRisk: 0,
    marketRisk: 0,
    systemicRisk: 0
  })

  const [alerts, setAlerts] = useState([])

  // Connect to risk service websocket
  const { data: riskStream } = useWebSocket('ws://risk-management-service:5000/risk-stream')
  const { data: sentimentStream } = useWebSocket('ws://sentiment-analysis-service:5000/sentiment-stream')

  // Fetch initial risk state
  useEffect(() => {
    async function fetchRiskState() {
      const [metricsRes, alertsRes] = await Promise.all([
        fetch(RISK_SERVICE_ENDPOINTS.metrics),
        fetch(RISK_SERVICE_ENDPOINTS.alerts)
      ])
      const [metrics, alerts] = await Promise.all([
        metricsRes.json(),
        alertsRes.json()
      ])
      setRiskMetrics(metrics)
      setAlerts(alerts)
    }
    fetchRiskState()
  }, [])

  // Update from websocket streams
  useEffect(() => {
    if (riskStream?.type === 'RISK_UPDATE') {
      setRiskMetrics(prev => ({
        ...prev,
        ...riskStream.metrics
      }))
    }
    if (riskStream?.type === 'ALERT') {
      setAlerts(prev => [...prev, riskStream.alert])
    }
  }, [riskStream])

  useEffect(() => {
    if (sentimentStream) {
      // Update sentiment-based risk metrics
      setRiskMetrics(prev => ({
        ...prev,
        marketRisk: calculateMarketRisk(prev.marketRisk, sentimentStream.sentiment)
      }))
    }
  }, [sentimentStream])

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

      <Card>
        <CardHeader>
          <CardTitle>Risk Correlation Matrix</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={riskMetrics.correlationHistory}>
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
    </div>
  )
}

function calculateMarketRisk(currentRisk: number, sentiment: number): number {
  // Blend current risk with sentiment influence
  const sentimentInfluence = (100 - sentiment) * 0.7
  return (currentRisk * 0.3) + sentimentInfluence
}