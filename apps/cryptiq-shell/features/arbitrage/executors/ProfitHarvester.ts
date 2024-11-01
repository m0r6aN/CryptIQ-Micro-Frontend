// File: features/arbitrage/executors/ProfitHarvester.ts

import { FlashLoanProvider } from '@/features/trading/types/screenerTypes'
import { GasOptimizer, TradeResult } from '@/features/trading/types/trading'
import { ethers } from 'ethers'
import { TradeStep } from '../scanners/FlashArbScanner'


interface ExecutionRoute {
  path: string[]
  expectedProfit: number
  flashLoanAmount: string
  steps: TradeStep[]
  backupRoutes: TradeStep[][]
}

export class ProfitHarvester {
  private readonly provider: ethers.providers.Provider
  private readonly flashLoaner: FlashLoanProvider
  private readonly gasOptimizer: GasOptimizer
  private readonly mevBuncher: MEVBuncher
  private readonly profitVault: string
  private isHarvesting: boolean

  constructor(
    provider: ethers.providers.Provider,
    config: {
      profitVault: string
      minProfitThreshold: number
      maxConcurrentExecutions: number
      gasMultiplier: number
    }
  ) {
    this.provider = provider
    this.flashLoaner = new FlashLoanProvider(provider)
    this.gasOptimizer = new GasOptimizer(config.gasMultiplier)
    this.mevBuncher = new MEVBuncher(provider)
    this.profitVault = config.profitVault
    this.isHarvesting = false
  }

  async executeArbitrage(route: ExecutionRoute): Promise<ExecutionResult> {
    try {
      // Optimize gas before execution
      const gasStrategy = await this.gasOptimizer.calculateOptimalGas()
      
      // Get flash loan
      const loan = await this.flashLoaner.requestLoan({
        token: route.steps[0].tokenIn,
        amount: route.flashLoanAmount,
        steps: route.steps
      })

      // Bundle transactions to prevent sandwich attacks
      const bundle = await this.mevBuncher.createBundle({
        loans: [loan],
        trades: route.steps,
        gasPrice: gasStrategy.gasPrice
      })

      // Execute the bundle
      const result = await this.mevBuncher.executeBundle(bundle)

      // Verify profit and move to vault
      if (result.success) {
        await this.harvestProfit(result.profit)
      }

      return result

    } catch (error) {
      // If main route fails, try backup routes
      for (const backupRoute of route.backupRoutes) {
        try {
          const backupResult = await this.executeBackupRoute(backupRoute)
          if (backupResult.success) {
            return backupResult
          }
        } catch (backupError) {
          console.error('Backup route failed:', backupError)
        }
      }
      
      throw new Error(`All routes failed: ${error.message}`)
    }
  }

  private async harvestProfit(profit: BigNumber): Promise<void> {
    const vaultContract = new ethers.Contract(
      this.profitVault,
      ['function deposit(uint256 amount)'],
      this.provider.getSigner()
    )

    // Split profit between vault and operating capital
    const vaultAmount = profit.mul(80).div(100) // 80% to vault
    const operatingAmount = profit.mul(20).div(100) // 20% for operations

    // Move profits to vault
    await vaultContract.deposit(vaultAmount, {
      gasPrice: await this.gasOptimizer.getOptimalGasPrice()
    })

    // Emit profit event for tracking
    this.emitProfitEvent({
      total: profit,
      vault: vaultAmount,
      operating: operatingAmount,
      timestamp: Date.now()
    })
  }

  private async executeBackupRoute(
    steps: TradeStep[]
  ): Promise<ExecutionResult> {
    // Similar to main execution but with higher gas price to ensure execution
    const gasPrice = (await this.gasOptimizer.getOptimalGasPrice()).mul(120).div(100)
    
    return this.executeSteps(steps, { gasPrice })
  }

  private emitProfitEvent(profit: ProfitEvent): void {
    // Emit event for real-time tracking
    this.emit('profit', {
      ...profit,
      cumulative: this.getCumulativeProfits()
    })
  }
}