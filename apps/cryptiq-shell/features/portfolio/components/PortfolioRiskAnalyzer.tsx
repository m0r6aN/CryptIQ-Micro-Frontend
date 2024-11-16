import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Shield, AlertTriangle, TrendingDown } from 'lucide-react'
import { useWebSocket } from '@/hooks/use-web-socket'

interface RiskMetrics {
  overallScore: number
  volatilityRisk: number
  liquidityRisk: number
  concentrationRisk: number
  alerts: string[]
}

export function PortfolioRiskAnalyzer() {
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics>({
    overallScore: 0,
    volatilityRisk: 0,
    liquidityRisk: 0,
    concentrationRisk: 0,
    alerts: []
  })

  useWebSocket({
    url: 'ws://risk-management-service:5000/portfolio-risk',
    onMessage: (msg) => {
      const data = JSON.parse(msg)
      setRiskMetrics(data)
    }
  })

  const getRiskColor = (score: number) => {
    if (score < 30) return 'bg-green-500'
    if (score < 70) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Risk Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span>Overall Risk Score</span>
                <span className="font-bold">{riskMetrics.overallScore}%</span>
              </div>
              <Progress 
                value={riskMetrics.overallScore} 
                className={getRiskColor(riskMetrics.overallScore)}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-gray-500">Volatility</span>
                <div className="text-xl font-bold">{riskMetrics.volatilityRisk}%</div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Liquidity</span>
                <div className="text-xl font-bold">{riskMetrics.liquidityRisk}%</div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Concentration</span>
                <div className="text-xl font-bold">{riskMetrics.concentrationRisk}%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {riskMetrics.alerts.length > 0 && (
        <div className="space-y-2">
          {riskMetrics.alerts.map((alert, i) => (
            <Alert key={i} variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{alert}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}
    </div>
  )
}