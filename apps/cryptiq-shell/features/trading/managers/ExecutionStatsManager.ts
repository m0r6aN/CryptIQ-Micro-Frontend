// File: features/trading/managers/ExecutionStatsManager.ts

import { BigNumber } from 'ethers'
import { ExecutionStats } from '../types/dexTypes'

export class ExecutionStatsManager {
    private stats: {
      totalExecutions: number
      successfulExecutions: number
      failedExecutions: number
      totalGasUsed: BigNumber
      totalProfit: BigNumber
      executionTimes: number[]
      lastUpdate: number
    }
  
    constructor() {
      this.stats = {
        totalExecutions: 0,
        successfulExecutions: 0,
        failedExecutions: 0,
        totalGasUsed: BigNumber.from(0),
        totalProfit: BigNumber.from(0),
        executionTimes: [],
        lastUpdate: Date.now()
      }
    }
  
    updateStats(execution: ExecutionStats) {
      this.stats.totalExecutions++
      if (execution.success) {
        this.stats.successfulExecutions++
        this.stats.totalProfit = this.stats.totalProfit.add(execution.profit)
      } else {
        this.stats.failedExecutions++
      }
  
      this.stats.totalGasUsed = this.stats.totalGasUsed.add(execution.gasUsed)
      this.stats.executionTimes.push(execution.executionTime)
      this.stats.lastUpdate = Date.now()
    }
  
    getSuccessRate(): number {
      return this.stats.totalExecutions > 0
        ? this.stats.successfulExecutions / this.stats.totalExecutions
        : 0
    }
  
    getAverageGasUsed(): BigNumber {
      return this.stats.totalExecutions > 0
        ? this.stats.totalGasUsed.div(this.stats.totalExecutions)
        : BigNumber.from(0)
    }
  
    getAverageExecutionTime(): number {
      return this.stats.executionTimes.length > 0
        ? this.stats.executionTimes.reduce((a, b) => a + b) / this.stats.executionTimes.length
        : 0
    }
  
    getTotalProfit(): BigNumber {
      return this.stats.totalProfit
    }
  }