export interface OptimizationParams {
    riskTolerance: number
    leverageMax: number
    rebalancePeriod: number
    stopLoss: number
    targetAllocation: Record<string, number>
  }
  
  export interface StrategyMetrics {
    sharpe: number
    sortino: number
    maxDrawdown: number
    annualizedReturn: number
    winRate: number
    correlations: Record<string, number>
  }
  
  export interface BacktestResult {
    timestamp: number
    portfolioValue: number
    benchmark: number
    pnl: number
    trades: Array<{
      asset: string
      side: 'buy' | 'sell'
      price: number
      size: number
      timestamp: number
    }>
  }
  
  export interface StreamMessage {
    type: 'METRICS_UPDATE' | 'BACKTEST_UPDATE' | 'OPTIMIZATION_COMPLETE' | 'STRATEGY_DEPLOYED'
    metrics?: StrategyMetrics
    result?: BacktestResult
    data?: string
    error?: string
  }