import React, { useEffect } from 'react'
import { usePortfolioStore } from '../state/portfolioStore'
import { useWebSocket } from '@/hooks/use-web-socket'
import { Brain, TrendingUp, ShieldAlert, Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PortfolioStats } from './PortfolioStats'
import { PortfolioChart } from './PortfolioChart'
import { AssetAllocation } from './AssetAllocation'

export default function AIPoweredPortfolio() {
  const { stats, setStats, assets, setAssets } = usePortfolioStore()

  // Connect to AI services
  const sentiment = useWebSocket({
    url: 'ws://sentiment-analysis-service:5000/stream',
    onMessage: (data) => handleSentimentUpdate(JSON.parse(data))
  })

  const risk = useWebSocket({
    url: 'ws://risk-management-service:5000/stream',
    onMessage: (data) => handleRiskUpdate(JSON.parse(data))
  })

  const market = useWebSocket({
    url: 'ws://market-analysis-service:5000/stream',
    onMessage: (data) => handleMarketUpdate(JSON.parse(data))
  })

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Sentiment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sentiment.data?.score || 'Loading...'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              Risk Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {risk.data?.score || 'Loading...'}
            </div>
          </CardContent>
        </Card>
      </div>

      <PortfolioStats stats={stats} />
      <PortfolioChart assets={assets} />
      <AssetAllocation assets={assets} totalValue={stats.totalValue} />
    </div>
  )
}