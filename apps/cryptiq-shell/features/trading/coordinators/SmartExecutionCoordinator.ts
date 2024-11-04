import { Contract, ethers } from 'ethers'

interface ExecutionSignal {
  confidence: number
  profitEstimate: number
  route: string[]
  amount: string
  swapData: string[]
  gasEstimate: number
  deadline: number
  liquidity: {
    [pool: string]: number
  }
  impactEstimate: number
}

interface ValidationResult {
  isValid: boolean
  reason?: string
  adjustedProfit?: number
}

export class SmartExecutionCoordinator {
  private signals: Map<string, ExecutionSignal> = new Map()
  private readonly profitThreshold: number
  private readonly confidenceThreshold: number
  private readonly maxImpact: number
  private lastExecutionTime: number = 0
  private readonly minExecutionInterval: number = 2000 // 2 seconds

  constructor(
    private contract: Contract,
    private agentUrls: string[],
    profitThreshold = 0.5,
    confidenceThreshold = 0.85,
    maxImpact = 0.5 // 0.5% max price impact
  ) {
    this.profitThreshold = profitThreshold
    this.confidenceThreshold = confidenceThreshold
    this.maxImpact = maxImpact
    this.initializeAgentStreams()
  }

  private initializeAgentStreams() {
    this.agentUrls.forEach(url => {
      const ws = new WebSocket(url)
      ws.onmessage = (event) => {
        const signal = JSON.parse(event.data)
        this.processSignal(signal)
      }
    })
  }

  private validateSignal(signal: ExecutionSignal): ValidationResult {
    // Basic validation
    if (signal.confidence < this.confidenceThreshold) {
      return { isValid: false, reason: 'Low confidence' }
    }

    if (signal.profitEstimate < this.profitThreshold) {
      return { isValid: false, reason: 'Below profit threshold' }
    }

    // Check deadline
    if (Date.now() >= signal.deadline) {
      return { isValid: false, reason: 'Signal expired' }
    }

    // Validate liquidity
    const minLiquidity = Math.max(...Object.values(signal.liquidity)) * 0.01 // 1% of max pool liquidity
    if (Object.values(signal.liquidity).some(l => l < minLiquidity)) {
      return { isValid: false, reason: 'Insufficient liquidity' }
    }

    // Check price impact
    if (signal.impactEstimate > this.maxImpact) {
      // Adjust profit estimate based on impact
      const impactCost = signal.profitEstimate * (signal.impactEstimate / 100)
      const adjustedProfit = signal.profitEstimate - impactCost
      
      if (adjustedProfit < this.profitThreshold) {
        return { isValid: false, reason: 'High impact reduces profit below threshold' }
      }
      
      return { 
        isValid: true, 
        adjustedProfit
      }
    }

    return { isValid: true }
  }

  private async processSignal(signal: ExecutionSignal) {
    const validation = this.validateSignal(signal)
    if (!validation.isValid) {
      console.log(`Signal rejected: ${validation.reason}`)
      return
    }

    // Update profit if adjusted due to impact
    if (validation.adjustedProfit) {
      signal.profitEstimate = validation.adjustedProfit
    }

    // Aggregate signals from different agents
    const existingSignal = this.signals.get(signal.route.join('-'))
    if (existingSignal) {
      signal.confidence = (signal.confidence + existingSignal.confidence) / 2
      signal.profitEstimate = Math.min(signal.profitEstimate, existingSignal.profitEstimate)
    }

    this.signals.set(signal.route.join('-'), signal)
    await this.evaluateExecution()
  }

  private async evaluateExecution() {
    // Rate limiting check
    if (Date.now() - this.lastExecutionTime < this.minExecutionInterval) {
      return
    }

    const validSignals = Array.from(this.signals.values())
      .filter(s => this.validateSignal(s).isValid)
      .sort((a, b) => b.profitEstimate - a.profitEstimate)

    if (validSignals.length >= 3) {
      const batches = validSignals.slice(0, 3)
      await this.executeBatchArbitrage(batches)
    } else if (validSignals.length > 0) {
      const best = validSignals[0]
      await this.executeArbitrage(best)
    }
  }

  private async executeArbitrage(signal: ExecutionSignal) {
    try {
      // Update execution timestamp before attempting
      this.lastExecutionTime = Date.now()

      const gasPrice = await this.contract.provider.getGasPrice()
      const gasCost = gasPrice.mul(signal.gasEstimate)
      
      // Double check profitability including gas
      const profitInWei = ethers.utils.parseEther(signal.profitEstimate.toString())
      if (profitInWei.lte(gasCost)) {
        console.log('Execution skipped: Gas cost exceeds profit')
        return
      }

      const tx = await this.contract.executeArbitrage(
        signal.route,
        signal.amount,
        signal.swapData,
        {
          gasLimit: signal.gasEstimate * 1.1, // 10% buffer
          gasPrice: gasPrice
        }
      )

      const receipt = await tx.wait()
      console.log(`Execution successful: ${receipt.transactionHash}`)
      
      // Clean up executed signal
      this.signals.delete(signal.route.join('-'))

    } catch (error) {
      console.error('Execution failed:', error)
      // Keep failed signal for analysis but mark it
      signal.confidence *= 0.8 // Reduce confidence after failure
    }
  }

  private async executeBatchArbitrage(signals: ExecutionSignal[]) {
    try {
      this.lastExecutionTime = Date.now()
      
      const totalGasEstimate = signals.reduce((sum, s) => sum + s.gasEstimate, 0)
      const gasPrice = await this.contract.provider.getGasPrice()
      
      const tx = await this.contract.batchExecuteArbitrage(
        signals.map(s => s.route),
        signals.map(s => s.amount),
        signals.map(s => s.swapData),
        {
          gasLimit: totalGasEstimate * 1.1,
          gasPrice: gasPrice
        }
      )

      const receipt = await tx.wait()
      console.log(`Batch execution successful: ${receipt.transactionHash}`)
      
      // Clean up executed signals
      signals.forEach(s => this.signals.delete(s.route.join('-')))

    } catch (error) {
      console.error('Batch execution failed:', error)
      // Reduce confidence in failed batch
      signals.forEach(s => {
        if (this.signals.has(s.route.join('-'))) {
          s.confidence *= 0.8
        }
      })
    }
  }
}