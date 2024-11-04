import { EventEmitter } from 'events'
import { AlertType } from '../../../../../packages/web3-sdk/src/types/alert'


interface AgentMetrics {
  agentId: string
  accuracy: number
  confidence: number
  latency: number
  predictions: number
  successRate: number
  lastUpdate: number
}

interface ExecutionMetrics {
  profitUSD: number
  gasUsed: number
  slippage: number
  impactPredicted: number
  impactActual: number
  route: string[]
  timestamp: number
}

export class AgentMonitoringCoordinator extends EventEmitter {
  private agentMetrics: Map<string, AgentMetrics> = new Map()
  private readonly agents = [
    'impact-predictor',
    'liquidity-analyzer',
    'timing-optimizer',
    'risk-evaluator',
    'sentiment-tracker'
  ]
  private executionHistory: ExecutionMetrics[] = []
  private aggregatedStats = {
    totalProfit: 0,
    totalGas: 0,
    successfulTrades: 0,
    failedTrades: 0,
    averageSlippage: 0,
    predictionAccuracy: 0
  }

  constructor(
    private wsEndpoints: Record<string, string>,
    private alertThresholds = {
      minAccuracy: 0.8,
      maxLatency: 1000,
      profitThreshold: 100,
      riskThreshold: 0.7
    }
  ) {
    super()
    this.initializeAgentConnections()
  }

  private initializeAgentConnections() {
    this.agents.forEach(agentId => {
      const ws = new WebSocket(this.wsEndpoints[agentId])
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        this.updateAgentMetrics(agentId, data)
        this.checkAlertConditions(agentId)
      }

      ws.onerror = (error) => {
        this.emitAlert({
          type: 'ERROR',
          severity: 'high',
          title: 'Agent Connection Lost',
          message: `Lost connection to ${agentId}. Performance may be degraded.`,
          timestamp: Date.now(),
          actionRequired: true
        })
      }
    })
  }

  private updateAgentMetrics(agentId: string, data: any) {
    const metrics: AgentMetrics = {
      agentId,
      accuracy: data.accuracy || 0,
      confidence: data.confidence || 0,
      latency: data.latency || 0,
      predictions: data.predictions || 0,
      successRate: data.successRate || 0,
      lastUpdate: Date.now()
    }

    this.agentMetrics.set(agentId, metrics)
    this.emit('metricsUpdate', this.getAggregatedMetrics())
  }

  public recordExecution(metrics: ExecutionMetrics) {
    this.executionHistory.push(metrics)
    this.executionHistory = this.executionHistory.slice(-1000) // Keep last 1000

    // Update aggregated stats
    this.aggregatedStats.totalProfit += metrics.profitUSD
    this.aggregatedStats.totalGas += metrics.gasUsed
    this.aggregatedStats.successfulTrades += metrics.profitUSD > 0 ? 1 : 0
    this.aggregatedStats.failedTrades += metrics.profitUSD <= 0 ? 1 : 0
    
    // Update running averages
    const totalTrades = this.aggregatedStats.successfulTrades + this.aggregatedStats.failedTrades
    this.aggregatedStats.averageSlippage = 
      (this.aggregatedStats.averageSlippage * (totalTrades - 1) + metrics.slippage) / totalTrades
    
    this.aggregatedStats.predictionAccuracy = 
      this.executionHistory.reduce((acc, curr) => 
        acc + (1 - Math.abs(curr.impactPredicted - curr.impactActual)), 0) / this.executionHistory.length

    this.emit('executionUpdate', {
      metrics,
      aggregatedStats: this.aggregatedStats
    })

    // Check for significant profit opportunities
    if (metrics.profitUSD > this.alertThresholds.profitThreshold) {
      this.emitAlert({
        type: 'PROFIT',
        severity: 'info',
        title: 'High Profit Trade Executed',
        message: `Successfully executed trade with ${metrics.profitUSD.toFixed(2)} USD profit`,
        timestamp: Date.now(),
        actionRequired: false
      })
    }
  }

  private checkAlertConditions(agentId: string) {
    const metrics = this.agentMetrics.get(agentId)
    if (!metrics) return

    if (metrics.accuracy < this.alertThresholds.minAccuracy) {
      this.emitAlert({
        type: 'PERFORMANCE',
        severity: 'medium',
        title: 'Agent Accuracy Drop',
        message: `${agentId} accuracy dropped below threshold: ${(metrics.accuracy * 100).toFixed(1)}%`,
        timestamp: Date.now(),
        actionRequired: true
      })
    }

    if (metrics.latency > this.alertThresholds.maxLatency) {
      this.emitAlert({
        type: 'LATENCY',
        severity: 'high',
        title: 'High Latency Detected',
        message: `${agentId} response time exceeded ${this.alertThresholds.maxLatency}ms`,
        timestamp: Date.now(),
        actionRequired: true
      })
    }
  }

  private emitAlert(alert: AlertType) {
    this.emit('alert', alert)
  }

  public getAggregatedMetrics() {
    return {
      agents: Array.from(this.agentMetrics.values()),
      stats: this.aggregatedStats,
      recentExecutions: this.executionHistory.slice(-10)
    }
  }

  public getPerformanceAnalysis() {
    const recentTrades = this.executionHistory.slice(-100)
    
    return {
      profitability: {
        total: this.aggregatedStats.totalProfit,
        average: this.aggregatedStats.totalProfit / (this.aggregatedStats.successfulTrades || 1),
        winRate: this.aggregatedStats.successfulTrades / 
          (this.aggregatedStats.successfulTrades + this.aggregatedStats.failedTrades || 1)
      },
      efficiency: {
        averageGasUsed: this.aggregatedStats.totalGas / recentTrades.length,
        profitPerGas: this.aggregatedStats.totalProfit / (this.aggregatedStats.totalGas || 1),
        averageSlippage: this.aggregatedStats.averageSlippage
      },
      predictions: {
        accuracy: this.aggregatedStats.predictionAccuracy,
        confidence: Array.from(this.agentMetrics.values())
          .reduce((acc, curr) => acc + curr.confidence, 0) / this.agentMetrics.size
      }
    }
  }
}