// File: features/arbitrage/scanners/FlashArbScanner.ts

import { calculateExpectedProfit, estimateGasCost } from "features/trading/utils/screenerUtils"
import { calculateOptimalTrade } from "./utils/arbitrageUtils"
import { ScalpingOpportunity } from "features/trading/types/screenerTypes"
import { ArbRoute, TradeStep } from "../types/arbitrage-system-types"

  
  export class FlashArbScanner {
    private readonly minProfitThreshold: number
    private readonly maxRouteLength: number
    private readonly gasBuffer: number
    private routeCache: Map<number, string[][]> = new Map()
  
    constructor(config: {
      minProfitThreshold: number
      maxRouteLength: number
      gasBuffer: number
    }) {
      this.minProfitThreshold = config.minProfitThreshold
      this.maxRouteLength = config.maxRouteLength
      this.gasBuffer = config.gasBuffer
    }
  
    async scanForOpportunities({
      prices,
      liquidity, 
      gasPrice,
      maxConcurrent = 50
    }: {
      prices: Map<string, Map<string, number>>
      liquidity: Map<string, Map<string, number>>
      gasPrice: number
      maxConcurrent?: number
    }): Promise<ArbRoute[]> {
      const exchanges = Array.from(prices.keys())
      const routes = this.getCachedRoutes(exchanges)
      
      const opportunities: ArbRoute[] = []
      for (let i = 0; i < routes.length; i += maxConcurrent) {
        const batch = routes.slice(i, i + maxConcurrent)
        const batchPromises = batch.map(route => 
          this.analyzeRoute({ // This passes the params correctly
            route,
            prices,
            liquidity,
            gasPrice
          })
        )
    
        const batchResults = await Promise.all(batchPromises)
        opportunities.push(
          ...batchResults
            .filter((opp): opp is ArbRoute => opp !== null)
            .filter(this.isRouteProfitable.bind(this))
        )
      }
    
      return opportunities.sort((a, b) => b.expectedProfit - a.expectedProfit)
    }

    private getCachedRoutes(exchanges: string[]): string[][] {
      // Cache route permutations by length
      return [2,3].flatMap(length => {
        const cached = this.routeCache.get(length)
        if (cached) return cached
        
        const routes = this.generateRoutes(exchanges, length) 
        this.routeCache.set(length, routes)
        return routes
      })
    }  
  
    private async analyzeRoute({
      route,
      prices,
      liquidity,
      gasPrice
    }: {
      route: string[]
      prices: Map<string, Map<string, number>>
      liquidity: Map<string, Map<string, number>>
      gasPrice: number
    }): Promise<ArbRoute | null> {
      try {
        const steps: TradeStep[] = []
        let simulatedAmount = '1000000' // USDC 6 decimals
        
        // Get first exchange prices for base metrics
        const firstExchangePrices = prices.get(route[0])
        const currentPrice = firstExchangePrices?.values().next().value || 0

        // Build opportunity object from route data
        const opportunity: ScalpingOpportunity = {
          symbol: `${route[0]}-${route[route.length-1]}`,
          price: currentPrice,
          change24h: 0, // Would need historical data
          volume: '0', // Changed to string per interface
          volatility: 0,
          orderBookLevels: {
            bids: 0, // Would need order book data
            asks: 0
          },
          dexLiquidity: {
            available: Array.from(liquidity.values())
              .reduce((sum, liq) => sum + Array.from(liq.values())
              .reduce((a, b) => a + b, 0), 0),
            routes: route.length,
            bestRoute: route
          }
          // TODO:  sentiment and whaleActivity are optional
        }
    
        // Simulate trades through the route
        for (let i = 0; i < route.length - 1; i++) {
          const exchange = route[i]
          const nextExchange = route[i + 1]
          
          const exchangePrices = prices.get(exchange)
          const exchangeLiquidity = liquidity.get(exchange)
          
          if (!exchangePrices || !exchangeLiquidity) continue
  
          const step = calculateOptimalTrade(
            exchangePrices,
            exchangeLiquidity,
            simulatedAmount
          )
  
          if (step) {
            steps.push(step)
            simulatedAmount = step.minReturn
          }
        }
  
        const estimatedGas = estimateGasCost(steps.length, gasPrice)
        const expectedProfit = calculateExpectedProfit({
          steps,
          estimatedGas,
          opportunity,
          initialAmount: simulatedAmount
        })
        const confidence = this.calculateRouteConfidence(steps, liquidity)
  
        return {
          path: route,
          expectedProfit: parseFloat(expectedProfit), // Convert string to number
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
  
    private calculateRouteConfidence(
      steps: TradeStep[], 
      liquidity: Map<string, Map<string, number>>
    ): number {
      let confidence = 100
    
      steps.forEach((step, index) => {
        const pair = `${step.tokenIn}-${step.tokenOut}`
        const exchangeLiquidity = liquidity.get(step.exchange)?.get(pair) || 0
        const tradeAmount = Number(step.amount)
    
        const liquidityRatio = exchangeLiquidity / tradeAmount
        if (liquidityRatio < 2) {
          confidence *= (liquidityRatio / 2)
        }
    
        confidence *= (1 - (index * 0.05))
        
        const exchangeReliability = this.getExchangeReliability(step.exchange)
        confidence *= exchangeReliability
      })
    
      return Math.min(Math.max(confidence, 0), 100)
    }
  
  private getExchangeReliability(exchange: string): number {
    // Mock reliability scores (should be replaced with actual historical data)
    const reliabilityMap: Record<string, number> = {
      'Uniswap': 0.98,
      'Sushiswap': 0.95,
      'Curve': 0.97,
      'Balancer': 0.94,
      'default': 0.90
    }
    
    return reliabilityMap[exchange] || reliabilityMap.default
  }

  private generateRoutes(exchanges: string[], length: number): string[][] {
      const routes: string[][] = []
      
      function permute(current: string[], remaining: string[]) {
        if (current.length === length) {
          routes.push([...current])
          return
        }
        
        for (let i = 0; i < remaining.length; i++) {
          const next = remaining[i]
          current.push(next)
          permute(current, remaining.filter((_, idx) => idx !== i))
          current.pop()
        }
      }
      
      permute([], exchanges)
      return routes
    }

    private isRouteProfitable(route: ArbRoute): boolean {
      return (
        route.expectedProfit > this.minProfitThreshold &&
        route.confidence > 0.95 &&
        route.estimatedGas * this.gasBuffer < route.expectedProfit
      )
    }
 
    // ... other private helper methods
  }