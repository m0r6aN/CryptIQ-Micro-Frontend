import { 
    JsonRpcProvider,
    TransactionRequest,
    TransactionResponse,
    Wallet,
    formatEther,
    parseEther
  } from 'ethers'

  import { 
    FlashbotsTransaction,
    BundleStats,
    BundleSimulation,
    MEVBuncherConfig 
  } from '../types/mev_trans_bundler_types'

  import { GasOptimizer } from './GasOptimizer'
  import { MultiCall } from '../types/MultiCall'
  
  export class MEVBuncher {
    private readonly provider: JsonRpcProvider
    private readonly gasOptimizer: GasOptimizer
    private readonly multiCall: MultiCall
    private readonly BUNDLE_TIMEOUT: number
    private readonly MIN_PROFIT_THRESHOLD: bigint
    private readonly MAX_BUNDLE_SIZE: number
    private readonly FRONTRUN_PROTECTION: boolean
    private readonly bundleWallet: Wallet
    
    
    constructor(
        provider: JsonRpcProvider, 
        signerKey: string,
        config?: MEVBuncherConfig
      ) {
        this.provider = provider
        this.gasOptimizer = new GasOptimizer(provider)
        this.multiCall = new MultiCall(provider)
        this.bundleWallet = new Wallet(signerKey, provider)
        this.BUNDLE_TIMEOUT = config?.bundleTimeout ?? 2 * 60 * 1000
        this.MIN_PROFIT_THRESHOLD = config?.minProfitThreshold ?? parseEther("0.01")
        this.MAX_BUNDLE_SIZE = config?.maxBundleSize ?? 10
        this.FRONTRUN_PROTECTION = config?.frontrunProtection ?? true
      }
  
      async simulateBundle(
        transactions: FlashbotsTransaction[], 
        blockNumber: number
      ): Promise<BundleSimulation> {
        if (this.FRONTRUN_PROTECTION) {
          await this.checkFrontrunningRisk(transactions)
        }
    
        // Simulate each transaction in sequence
        let totalGasUsed = 0n
        let totalProfit = 0n
    
        try {
          for (const tx of transactions) {
            const result = await this.provider.call({
              ...tx,
              from: this.bundleWallet.address
            })
            
            const gasEstimate = await this.provider.estimateGas({
              ...tx,
              from: this.bundleWallet.address
            })
    
            totalGasUsed += gasEstimate
            totalProfit += this.extractProfitFromResult(result)
          }
    
          return {
            success: true,
            gasUsed: totalGasUsed,
            profit: totalProfit,
          }
        } catch (error) {
          return {
            success: false,
            gasUsed: 0n,
            profit: 0n,
            revertReason: (error as Error).message
          }
        }
      }
    
      async submitBundle(
        transactions: FlashbotsTransaction[],
        targetBlockNumber: number,
        options = { 
          maxBlockNumber: 0,
          minTimestamp: 0,
          revertingTxHashes: [] as string[]
        }
      ) {
        const optimizedBundle = await this.optimizeBundle(transactions)
        const simulation = await this.simulateBundle(optimizedBundle, targetBlockNumber)
    
        if (!simulation.success || simulation.profit < this.MIN_PROFIT_THRESHOLD) {
          throw new Error('Bundle optimization failed or insufficient profit')
        }
    
        // Sign and send transactions in rapid succession
        const signedTxs = await Promise.all(
          optimizedBundle.map(tx => this.bundleWallet.signTransaction(tx))
        )
    
        const txResponses = await Promise.all(
          signedTxs.map(signedTx => this.provider.broadcastTransaction(signedTx))
        )
    
        const bundleHash = txResponses[0].hash
    
        return {
          bundleHash,
          targetBlock: targetBlockNumber,
          simulation,
          stats: await this.getBundleStats(optimizedBundle, simulation)
        }
      }
  
      async optimizeBundle(transactions: FlashbotsTransaction[]): Promise<FlashbotsTransaction[]> {
        if (transactions.length > this.MAX_BUNDLE_SIZE) {
          throw new Error(`Bundle size exceeds maximum of ${this.MAX_BUNDLE_SIZE}`)
        }
    
        const optimizedTxs: FlashbotsTransaction[] = []
        let totalGasUsed = 0n
    
        // Batch simulate transactions using multicall
        const simResults = await this.multiCall.batch(
          transactions.map(tx => ({
            target: tx.to as string,
            callData: tx.data as string
          }))
        )
    
        for (let i = 0; i < transactions.length; i++) {
          const tx = transactions[i]
          const simResult = simResults[i]
          
          const optimizedGas = await this.gasOptimizer.optimizeGasPrice({
            gasLimit: tx.gasLimit as bigint,
            simulatedGasUsed: simResult.gasUsed
          })
    
          const projectedProfit = await this.simulateProfit({
            ...tx,
            gasPrice: optimizedGas.price,
            gasLimit: optimizedGas.limit
          })
    
          if (projectedProfit > this.MIN_PROFIT_THRESHOLD) {
            optimizedTxs.push({
              ...tx,
              gasPrice: optimizedGas.price,
              gasLimit: optimizedGas.limit
            })
            totalGasUsed += optimizedGas.limit
          }
        }
    
        return optimizedTxs
      }

      private async checkFrontrunningRisk(transactions: FlashbotsTransaction[]) {
        const mempool = await this.provider.send('eth_getBlockWithTransactions', ['pending'])
        const pending = mempool.transactions as TransactionResponse[]
        
        for (const tx of transactions) {
          const similar = pending.filter(p => 
            p.to === tx.to && 
            p.data?.slice(0, 10) === tx.data?.slice(0, 10) &&
            (p.gasPrice as bigint) > (tx.gasPrice as bigint)
          )
    
          if (similar.length > 0) {
            throw new Error('High frontrunning risk detected')
          }
        }
      }
  
    private extractProfitFromResult(result: string): bigint {
        // Extract profit from transaction result
        // This will depend on your specific use case
        try {
          return BigInt(result || '0')
        } catch {
          return 0n
        }
      }
    

    private async getBundleStats(
        transactions: FlashbotsTransaction[], 
        simulation: BundleSimulation
      ): Promise<BundleStats> {
        const competitionEstimate = await this.estimateCompetition(simulation.profit)
        
        return {
          expectedProfit: simulation.profit,
          gasUsed: simulation.gasUsed,
          bundleScore: this.calculateBundleScore(simulation, competitionEstimate),
          competitionEstimate
        }
      }
  
    private calculateBundleScore(
      simulation: BundleSimulation, 
      competition: number
    ): number {
      const profitScore = Number(formatEther(simulation.profit))
      const gasScore = 1 - (Number(simulation.gasUsed) / 30000000) // 30M gas block limit
      const competitionScore = 1 - (competition / 100)
  
      return (profitScore * 0.5) + (gasScore * 0.3) + (competitionScore * 0.2)
    }
  
    private async estimateCompetition(profit: bigint): Promise<number> {
      const currentBlock = await this.provider.getBlockNumber()
      const recentBlocks = await Promise.all(
        Array.from({ length: 10 }, (_, i) => 
          this.provider.getBlock(currentBlock - i)
        )
      )
  
      const avgGasUsed = recentBlocks.reduce((acc, block) => 
        acc + Number(block?.gasUsed || 0), 0
      ) / recentBlocks.length
  
      return Math.min(100, (avgGasUsed / 30000000) * 100)
    }
  
    private async simulateProfit(tx: FlashbotsTransaction): Promise<bigint> {
        const gasPriceBigInt = BigInt(tx.gasPrice as string) // Convert BigNumberish to bigint
        const gasCost = gasPriceBigInt * (tx.gasLimit as bigint)
        
        try {
          const result = await this.provider.call({
            ...tx,
            from: this.bundleWallet.address
          })
          return this.extractProfitFromResult(result) - gasCost
        } catch {
          return 0n
        }
      }
      
    async monitorBundleStatus(
        bundleHash: string, 
        targetBlock: number
      ): Promise<'included' | 'failed' | 'pending'> {
        const deadline = Date.now() + this.BUNDLE_TIMEOUT
        
        while (Date.now() < deadline) {
          const block = await this.provider.getBlock(targetBlock, true)
          
          if (block) {
            const bundleIncluded = block.transactions.some(tx => {
              if (typeof tx === 'string') {
                return tx.toLowerCase() === bundleHash.toLowerCase()
              }
              return (tx as TransactionResponse).hash.toLowerCase() === bundleHash.toLowerCase()
            })
            return bundleIncluded ? 'included' : 'failed'
          }
          
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
        
        return 'pending'
      }
  }