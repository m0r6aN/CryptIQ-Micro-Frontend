// app/features/portfolio/components/PortfolioDashboard.tsx

import { usePortfolioStore } from '../state/portfolioStore'
import { useWebSocket } from '@/features/shared/hooks/useWebSocket'
import { PortfolioStats } from './PortfolioStats'
import { PortfolioChart } from './PortfolioChart'
import { AssetAllocation } from './AssetAllocation'
import { WebSocketMessage } from '../types/portfolio'

export function PortfolioDashboard() {
  const { stats, assets, setAssets, setStats } = usePortfolioStore()

  useWebSocket<WebSocketMessage>({
    url: 'wss://api.cryptiq.com/portfolio/stream',
    onMessage: (data) => {
      if (data.type === 'ASSETS_UPDATE' && data.assets) {
        setAssets(data.assets)
      } else if (data.type === 'STATS_UPDATE' && data.stats) {
        setStats(data.stats)
      }
    }
  })

  return (
    <div className="p-6 space-y-6">
      <PortfolioStats stats={stats} />
      <PortfolioChart assets={assets} />
      <AssetAllocation assets={assets} totalValue={stats.totalValue} />
    </div>
  )
}