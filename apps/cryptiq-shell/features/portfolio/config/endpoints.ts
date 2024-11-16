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

  export const AI_BASED_SERVICES = {
    portfolio:{

    },
    OptimizationEngine: '',
    HealthMonitor: '',
    LeverageAllocationEngine: '',
    DynamicAssetAllocation: ''

  } as const

  export const AGENT_API = {
    assistant: '/api/ai_assistant',
    agentmonitor: '/api/agent_monitor_service',
    darkpool: '/api/agents/darkPool_agent',
    regime: '/api/agents/regime_agent',
    risk: '/api/agents/risk_agent',
    sentiment: '/api/agents/sentiment_agent',
    signalSynthesis: '/api/agents/signal_synthesis_agent',
    technicalPattern: '/api/agents/techical_patter_agent',
  } as const

  export const WEB3_API = {
    arbitrage: '/api/ai_assistant',
    blockchain: '/api/agent_monitor_service',
    darkpool: '/api/agents/darkPool_agent',
    regime: '/api/agents/regime_agent',
    risk: '/api/agents/risk_agent',
    sentiment: '/api/agents/sentiment_agent',
    signalSynthesis: '/api/agents/signal_synthesis_agent',
    technicalPattern: '/api/agents/techical_patter_agent',
  } as const