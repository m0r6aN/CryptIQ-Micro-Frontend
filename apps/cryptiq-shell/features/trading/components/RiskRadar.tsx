import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/features/shared/ui/card'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { AlertTriangle } from 'lucide-react'
import { useWebSocket } from '@/features/shared/hooks/useWebSocket'
import { RiskAlert, RiskWebSocketMessage, SentimentWebSocketMessage } from '@/features/shared/types/websockets'

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

  const [alerts, setAlerts] = useState<RiskAlert[]>([])

  // Then update your WebSocket hooks
  const { lastMessage: riskLastMessage } = useWebSocket<RiskWebSocketMessage>({
    url: 'ws://risk-management-service:5000/risk-stream',
    onMessage: (data) => {
      console.log('Risk message received:', data)
    }
  })

  const { lastMessage: sentimentLastMessage } = useWebSocket<SentimentWebSocketMessage>({
    url: 'ws://sentiment-analysis-service:5000/sentiment-stream',
    onMessage: (data) => {
      console.log('Sentiment message received:', data)
    }
  })

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

  // Add this new state and useEffect to transform the data
  const [correlationData, setCorrelationData] = useState<any[]>([]);

  useEffect(() => {
    // Assuming you have a function to transform riskMetrics into the required format
    const transformedData = transformRiskMetricsToChartData(riskMetrics);
    setCorrelationData(transformedData);
  }, [riskMetrics]);

  function transformRiskMetricsToChartData(metrics: { correlationRisk: any; volatilityRisk?: number; liquidityRisk?: number; marketRisk?: number; systemicRisk?: number }) 
  {
    // Example transformation logic
    return [
      { timestamp: '2023-01-01', btc: metrics.correlationRisk, eth: 0, sol: 0 },
      // Add more data points as needed
    ];
  }

  useEffect(() => {
    if (riskLastMessage) {
      if (riskLastMessage.type === 'RISK_UPDATE') {
        setRiskMetrics(prev => ({
          ...prev,
          ...riskLastMessage.metrics
        }))
      }
    }
  }, [riskLastMessage])

  useEffect(() => {
    if (sentimentLastMessage) {
      setRiskMetrics(prev => ({
        ...prev,
        marketRisk: calculateMarketRisk(prev.marketRisk, sentimentLastMessage.sentiment)
      }))
    }
  }, [sentimentLastMessage])

  const RiskGauge = ({ value, label, color = 'blue' }: { value: number; label: string; color?: string }) => (
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
            <LineChart data={correlationData}>
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