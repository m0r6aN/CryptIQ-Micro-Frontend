// components/portfolio/PortfolioStats.tsx

import { DollarSign, Activity, TrendingUp, Percent } from 'lucide-react'
import { StatsCard } from './StatsCard'
import { PortfolioStatsProps } from '@/features/trading/types/props'


export function PortfolioStats({ stats }: PortfolioStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Portfolio Value"
        value={`$${stats.totalValue.toLocaleString()}`}
        change={stats.dailyPnlPercentage}
        icon={<DollarSign className="h-4 w-4" />}
      />
      <StatsCard
        title="24h Change"
        value={`$${stats.dailyPnl.toLocaleString()}`}
        change={stats.dailyPnlPercentage}
        icon={<Activity className="h-4 w-4" />}
      />
      <StatsCard
        title="Total P&L"
        value={`$${stats.totalPnl.toLocaleString()}`}
        change={stats.totalPnlPercentage}
        icon={<TrendingUp className="h-4 w-4" />}
      />
      <StatsCard
        title="ROI"
        value={`${stats.totalPnlPercentage.toFixed(2)}%`}
        change={stats.dailyPnlPercentage}
        icon={<Percent className="h-4 w-4" />}
      />
    </div>
  )
}