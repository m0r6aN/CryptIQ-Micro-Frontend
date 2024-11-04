import { useState, useEffect } from 'react'
import { AgentMonitoringCoordinator } from '../coordinators/AgentMonitoringCoordinator'
import { AlertType } from '../../../../../packages/web3-sdk/src/types/alert'

const AGENT_ENDPOINTS = {
  'impact-predictor': 'ws://trading-service:5000/agent/impact',
  'liquidity-analyzer': 'ws://trading-service:5000/agent/liquidity',
  'timing-optimizer': 'ws://trading-service:5000/agent/timing',
  'risk-evaluator': 'ws://trading-service:5000/agent/risk',
  'sentiment-tracker': 'ws://trading-service:5000/agent/sentiment'
} as const

export function useAgentMonitoring() {
  const [coordinator] = useState(() => 
    new AgentMonitoringCoordinator(AGENT_ENDPOINTS)
  )
  
  const [metrics, setMetrics] = useState(coordinator.getAggregatedMetrics())
  const [alerts, setAlerts] = useState<AlertType[]>([])
  const [analysis, setAnalysis] = useState(coordinator.getPerformanceAnalysis())

  useEffect(() => {
    coordinator.on('metricsUpdate', setMetrics)
    coordinator.on('alert', (alert: AlertType) => 
      setAlerts(prev => [...prev, alert].slice(-10))
    )

    // Update analysis every 30 seconds
    const analysisInterval = setInterval(() => {
      setAnalysis(coordinator.getPerformanceAnalysis())
    }, 30000)

    return () => {
      coordinator.removeAllListeners()
      clearInterval(analysisInterval)
    }
  }, [coordinator])

  return {
    metrics,
    alerts,
    analysis,
    recordExecution: coordinator.recordExecution.bind(coordinator)
  }
}