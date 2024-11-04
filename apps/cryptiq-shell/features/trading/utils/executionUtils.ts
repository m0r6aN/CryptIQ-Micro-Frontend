import { ExecutionStats } from "../types/executionTypes"
import { MarketState } from "../types/marketTypes"
import { calculateRollingAverage, calculateSuccessRate } from "./calculations"
import { createClient } from '@supabase/supabase-js'

export function updateExecutionStats(
  stats: ExecutionStats,
  previousState: MarketState['executionStats']
): MarketState['executionStats'] {
  const profitLoss = stats.profit - stats.gasUsed
  const priceDeviation = Math.abs(stats.executionPrice - stats.marketPrice) / stats.marketPrice * 100

  // Calculate new execution stats
  const newStats = {
    profitLoss,
    priceDeviation,
    recentExecutions: [stats, ...(previousState?.recentExecutions || [])].slice(0, 10),
    avgExecutionTime: calculateRollingAverage(
      previousState?.avgExecutionTime,
      stats.executionTime
    ),
    avgSlippage: calculateRollingAverage(
      previousState?.avgSlippage,
      stats.slippage
    ),
    successRate: calculateSuccessRate(
      previousState?.recentExecutions || [],
      stats
    )
  }

  // Update Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  supabase
    .from('execution_stats')
    .insert([{
      route: stats.route,
      amount: stats.amount,
      execution_price: stats.executionPrice,
      market_price: stats.marketPrice,
      slippage: stats.slippage,
      gas_used: stats.gasUsed,
      profit: stats.profit,
      status: stats.status,
      execution_time: stats.executionTime,
      price_impact: stats.priceImpact,
      timestamp: new Date().toISOString(),
      pool_id: stats.pool_id,
      exchange: stats.exchange
    }])
    .then(({ error }) => {
      if (error) console.error('Failed to save execution stats:', error)
    })

  return newStats
}