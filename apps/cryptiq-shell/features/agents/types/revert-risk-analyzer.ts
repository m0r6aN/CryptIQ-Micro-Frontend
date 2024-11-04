import { 
    Contract, 
    Interface, 
    Provider, 
    ContractTransactionResponse,
    Log,
    Block,
    FilterByBlockHash,
    FunctionFragment
  } from 'ethers'
  import { ExecutionResult, RiskScore, Route } from 'features/arbitrage/types/arbitrage-system-types'
  
  interface RevertStats {
    totalAttempts: number
    revertCount: number
    gasUsed: bigint
    commonErrors: Map<string, number>
    lastSuccess: number
  }
  
  export class RevertRiskAnalyzer {
    private revertHistory: Map<string, RevertStats> = new Map()
    private readonly maxHistoryAge = 3600 * 1000 // 1 hour
    private readonly minDataPoints = 10
    private contractInterfaces: Map<string, Interface> = new Map()
    
    constructor(
      private provider: Provider,
      private dexInterfaces: Record<string, Interface>,
      private blacklistedMethods = new Set([
        'transferFrom',
        'transfer',
        'permit'
      ])
    ) {
      this.initializeInterfaces()
    }
  
    private initializeInterfaces() {
      for (const [dexName, contractABI] of Object.entries(this.dexInterfaces)) {
        this.contractInterfaces.set(dexName, contractABI)
      }
    }
  
    async analyzeHistoricalReverts(route: string[]): Promise<number> {
      const routeKey = route.join('-')
      const stats = this.revertHistory.get(routeKey) || {
        totalAttempts: 0,
        revertCount: 0,
        gasUsed: 0n,
        commonErrors: new Map(),
        lastSuccess: 0
      }
  
      if (Date.now() - stats.lastSuccess > this.maxHistoryAge) {
        this.revertHistory.delete(routeKey)
        return 0
      }
  
      return stats.totalAttempts > this.minDataPoints ? 
        (stats.revertCount / stats.totalAttempts) : 0
    }
  
    async checkContractInteractions(path: string[]): Promise<RiskScore> {
      const risks: RiskScore = {
        score: 0,
        confidence: 0,
        factors: {
          historicalReverts: 0,
          contractRisk: 0,
          gasRisk: 0,
          complexityRisk: 0
        },
        recommendations: []
      }
  
      for (let i = 0; i < path.length; i++) {
        const contractInterface = this.contractInterfaces.get('Generic')
        if (!contractInterface) {
          console.error(`No interface found for contract at ${path[i]}`)
          continue
        }
        const contract = new Contract(path[i], contractInterface, this.provider)
        
        try {
          const code = await this.provider.getCode(path[i])
          if (code === '0x') {
            risks.recommendations.push(`Contract at ${path[i]} has no code`)
            risks.factors.contractRisk += 25
            continue
          }
  
          const methodsUsed = await this.identifyMethodCalls(code)
          const riskyMethods = methodsUsed.filter(m => this.blacklistedMethods.has(m))
          
          if (riskyMethods.length > 0) {
            risks.recommendations.push(
              `Contract uses potentially risky methods: ${riskyMethods.join(', ')}`
            )
            risks.factors.contractRisk += riskyMethods.length * 10
          }
  
          // Updated event filtering for v6
          const eventFilter = contract.filters.Error()
          const blockNumber = await this.provider.getBlockNumber()
          const recentLogs = await contract.queryFilter(
            eventFilter,
            blockNumber - 1000,
            blockNumber
          )
          
          const recentReverts = recentLogs.filter(log => {
            try {
              const decodedLog = contract.interface.parseLog({
                topics: log.topics as string[],
                data: log.data
              })
              return decodedLog?.args?.some(arg => 
                arg?.toString().toLowerCase().includes('revert')
              )
            } catch {
              return false
            }
          })
          
          if (recentReverts.length > 0) {
            risks.factors.historicalReverts += (recentReverts.length / recentLogs.length) * 50
            risks.recommendations.push(
              `Contract has ${recentReverts.length} reverts in last 1000 interactions`
            )
          }
  
        } catch (error) {
          console.error(`Error analyzing contract ${path[i]}:`, error)
          risks.factors.contractRisk += 15
          risks.recommendations.push(`Unable to analyze contract at ${path[i]}`)
        }
      }
  
      const uniqueContracts = new Set(path).size
      risks.factors.complexityRisk = Math.min(
        ((path.length * 10) + (uniqueContracts * 5)), 
        100
      )
  
      const gasPrice = await this.provider.getFeeData()
      const baseGasPrice = await this.getHistoricalBaseGas()
      risks.factors.gasRisk = Math.min(
        ((Number(gasPrice.gasPrice ?? 0) - Number(baseGasPrice)) / Number(baseGasPrice)) * 100,
        100
      )
  
      risks.score = Object.values(risks.factors)
        .reduce((acc, val) => acc + val, 0) / 4
  
      risks.confidence = Math.min(
        (path.length * 10) + (uniqueContracts * 5),
        100
      )
  
      return risks
    }
  
    private async identifyMethodCalls(bytecode: string): Promise<string[]> {
      const methods = new Set<string>()
      for (const [name, iface] of this.contractInterfaces) {
        // Get function signatures from the interface
        const functionNames = Object.keys(iface.fragments).filter(key => 
          iface.getFunction(key) !== null
        )
        
        for (const functionName of functionNames) {
          const fragment = iface.getFunction(functionName)
          if (fragment) {
            const selector = fragment.selector
            if (selector && bytecode.includes(selector.slice(2))) { // Remove '0x' prefix
              methods.add(fragment.name)
            }
          }
        }
      }
      return Array.from(methods)
    }
  
    private async getHistoricalBaseGas(): Promise<bigint> {
      const blockNumber = await this.provider.getBlockNumber()
      const blocks = await Promise.all(
        Array.from({ length: 10 }, (_, i) => 
          this.provider.getBlock(blockNumber - i)
        )
      )
      
      const validBlocks = blocks.filter((block): block is Block => 
        block !== null && block.baseFeePerGas !== null
      )
      
      if (validBlocks.length === 0) {
        return 0n
      }
      
      return validBlocks.reduce((acc, block) => 
        acc + block.baseFeePerGas!, 
        0n
      ) / BigInt(validBlocks.length)
    }
  
    public recordExecution(
      result: ExecutionResult,
      route: Route
    ) {
      const routeKey = route.path.join('-')
      const stats = this.revertHistory.get(routeKey) || {
        totalAttempts: 0,
        revertCount: 0,
        gasUsed: 0n,
        commonErrors: new Map(),
        lastSuccess: 0
      }
  
      stats.totalAttempts++
      stats.gasUsed = stats.gasUsed + result.gasUsed
  
      if (!result.success) {
        stats.revertCount++
        if (result.error) {
          stats.commonErrors.set(
            result.error,
            (stats.commonErrors.get(result.error) || 0) + 1
          )
        }
      } else {
        stats.lastSuccess = result.timestamp
      }
  
      this.revertHistory.set(routeKey, stats)
    }
  }