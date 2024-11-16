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
} as const;

export const SERVICES = {
    portfolio: {
        OptimizationEngine: '/portfolio/analysis/dynamic_portfolio_optimization_engine.py',
        HealthMonitor: '/portfolio/analysis/multi_asset_portfolio_health_monitor.py',
        LeverageAllocationEngine: '/portfolio/analysis/smart_leverage_allocation_engine.py',
        DynamicAssetAllocation: '/portfolio/analysis/ai_driven_dynamic_asset_allocation_optimizer.py'
    },
    monitoring: {
        contractEvents: '/portfolio/monitoring/smart_contract_event_monitor.py',
        liquidityPool: '/portfolio/monitoring/smart_liquidity_pool_monitor.py',
        marketDepth: '/portfolio/monitoring/smart_market_depth_analyzer.py'
    },
    riskManagement: {
        dynamicCorrelationRiskMonitor: '/portfolio/risk_management/dynamic_correlation_risk_monitor.py',
        dynamicRiskExposureCalculator: '/portfolio/risk_management/dynamic_risk_exposure_calculator.py'
    }
} as const;

export const AGENT_API = {
    assistant: '/api/ai_assistant',
    agentMonitor: '/api/agent_monitor_service',
    darkPool: '/api/agents/darkPool_agent',
    regime: '/api/agents/regime_agent',
    risk: '/api/agents/risk_agent',
    sentiment: '/api/agents/sentiment_agent',
    signalSynthesis: '/api/agents/signal_synthesis_agent',
    technicalPattern: '/api/agents/technical_pattern_agent'
} as const;

export const WEB3_API = {
    arbitrage: '/arbitrage/cross-chain/flash-loan-arbitrage/ai-arbitrage-detector.py',
    blockchain: '/blockchain-service/dex/price-streaming.py',
    darkPool: '/agents/darkPool_agent/dark_pool_volume_agent.py',
    regime: '/agents/regime_agent/app.py',
    risk: '/agents/risk_agent/app.py',
    sentiment: '/agents/sentiment_agent/app.py',
    signalSynthesis: '/agents/signal_synthesis_agent/signal_synthesis_agent.py',
    technicalPattern: '/agents/technical_pattern_agent/technical_pattern_agent.py'
} as const;
