export const PORTFOLIO_SERVICE = {
    optimize: '/api/portfolio/optimize',
    backtest: '/api/portfolio/backtest',
    deploy: '/api/portfolio/deploy-strategy',
    metrics: '/api/portfolio/metrics',
    rebalance: '/api/portfolio/rebalance',
    ws: {
      portfolio: 'wss://api.yourservice.com/portfolio/stream',
      market: 'wss://api.yourservice.com/market/stream'
    }
  } as const