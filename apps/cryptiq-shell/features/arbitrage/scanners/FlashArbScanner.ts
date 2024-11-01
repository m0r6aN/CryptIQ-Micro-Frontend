// File: features/arbitrage/scanners/FlashArbScanner.ts

export interface ArbRoute {
    path: string[]
    expectedProfit: number
    requiredCapital: number
    estimatedGas: number
    confidence: number
    executionSteps: TradeStep[]
  }
  
export  interface TradeStep {
    exchange: string
    tokenIn: string
    tokenOut: string
    amount: string
    minReturn: string
    route?: string[]
  }
  
  export class FlashArbScanner {
    private readonly minProfitThreshold: number
    private readonly maxRouteLength: number
    private readonly gasBuffer: number
  
    constructor(config: {
      minProfitThreshold: number
      maxRouteLength: number
      gasBuffer: number
    }) {
      this.minProfitThreshold = config.minProfitThreshold
      this.maxRouteLength = config.maxRouteLength
      this.gasBuffer = config.gasBuffer
    }
  
    async scanForOpportunities(
      prices: Map<string, Map<string, number>>,
      liquidity: Map<string, Map<string, number>>,
      gasPrice: number
    ): Promise<ArbRoute[]> {
      const opportunities: ArbRoute[] = []
      const exchanges = Array.from(prices.keys())
  
      // Scan all possible routes up to maxRouteLength
      for (let i = 2; i <= this.maxRouteLength; i++) {
        const routes = this.generateRoutes(exchanges, i)
        
        for (const route of routes) {
          const opportunity = await this.analyzeRoute(
            route, 
            prices, 
            liquidity, 
            gasPrice
          )
          
          if (opportunity && this.isRouteProfitable(opportunity)) {
            opportunities.push(opportunity)
          }
        }
      }
  
      return opportunities.sort((a, b) => b.expectedProfit - a.expectedProfit)
    }
  
    private async analyzeRoute(
      route: string[],
      prices: Map<string, Map<string, number>>,
      liquidity: Map<string, Map<string, number>>,
      gasPrice: number
    ): Promise<ArbRoute | null> {
      try {
        const steps: TradeStep[] = []
        let simulatedAmount = '1000000' // USDC 6 decimals
        
        // Simulate trades through the route
        for (let i = 0; i < route.length - 1; i++) {
          const exchange = route[i]
          const nextExchange = route[i + 1]
          
          const exchangePrices = prices.get(exchange)
          const exchangeLiquidity = liquidity.get(exchange)
          
          if (!exchangePrices || !exchangeLiquidity) continue
  
          const step = this.calculateOptimalTrade(
            exchangePrices,
            exchangeLiquidity,
            simulatedAmount
          )
  
          if (step) {
            steps.push(step)
            simulatedAmount = step.minReturn
          }
        }
  
        const estimatedGas = this.estimateGasCost(steps.length, gasPrice)
        const expectedProfit = this.calculateExpectedProfit(steps, estimatedGas)
        const confidence = this.calculateRouteConfidence(steps, liquidity)
  
        return {
          path: route,
          expectedProfit,
          requiredCapital: parseInt(steps[0].amount),
          estimatedGas,
          confidence,
          executionSteps: steps
        }
  
      } catch (error) {
        console.error(`Error analyzing route: ${route.join(' -> ')}`, error)
        return null
      }
    }
  
    private isRouteProfitable(route: ArbRoute): boolean {
      return (
        route.expectedProfit > this.minProfitThreshold &&
        route.confidence > 0.95 &&
        route.estimatedGas * this.gasBuffer < route.expectedProfit
      )
    }
  
    private calculateRouteConfidence(
      steps: TradeStep[],
      liquidity: Map<string, Map<string, number>>
    ): number {
      // Calculate confidence based on liquidity depth and route complexity
      let confidence = 1.0
      
      steps.forEach(step => {
        const exchangeLiquidity = liquidity.get(step.exchange)
        if (exchangeLiquidity) {
          const stepLiquidity = exchangeLiquidity.get(`${step.tokenIn}-${step.tokenOut}`)
          if (stepLiquidity) {
            // Reduce confidence based on trade size vs liquidity
            const liquidityRatio = parseInt(step.amount) / stepLiquidity
            confidence *= (1 - Math.min(liquidityRatio, 0.5))
          }
        }
      })
  
      // Reduce confidence based on route length
      confidence *= Math.pow(0.99, steps.length)
  
      return confidence
    }
  
    // ... other private helper methods
  }