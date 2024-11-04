// features/arbitrage/scanners/utils/arbitrageUtils.ts

import { TradeStep } from "features/arbitrage/types/arbitrage-system-types"

export function generateRoutes(exchanges: string[], length: number): string[][] {
    const routes: string[][] = []
    
    function permute(arr: string[], size: number) {
      if (size === 1) {
        // Ensure route ends where it started for flash loans
        if (arr[0] === arr[arr.length - 1]) {
          routes.push([...arr])
        }
        return
      }
      
      for (let i = 0; i < size; i++) {
        permute(arr, size - 1)
        
        // If size is odd, swap first and last element
        if (size % 2 === 1) {
          [arr[0], arr[size - 1]] = [arr[size - 1], arr[0]]
        }
        // If size is even, swap ith and last element
        else {
          [arr[i], arr[size - 1]] = [arr[size - 1], arr[i]]
        }
      }
    }
  
    // Start with combinations that begin and end with same exchange
    exchanges.forEach(startExchange => {
      const baseRoute = [startExchange]
      const availableExchanges = exchanges.filter(e => e !== startExchange)
      
      // Generate combinations for middle exchanges
      for (let i = 0; i < length - 2; i++) {
        availableExchanges.forEach(exchange => {
          const route = [...baseRoute]
          route.push(exchange)
          if (route.length === length - 1) {
            route.push(startExchange) // Close the loop
            routes.push(route)
          }
        })
      }
    })
  
    return routes
  }
  
  export function calculateOptimalTrade(
    exchangePrices: Map<string, number>,
    exchangeLiquidity: Map<string, number>,
    amount: string
  ): TradeStep | null {
    try {
      const amountNum = parseInt(amount);
      if (isNaN(amountNum)) throw new Error('Invalid amount value');
  
      let bestStep: TradeStep | null = null;
      let maxReturn = 0;
  
      // Try all possible token pairs in the exchange
      exchangePrices.forEach((price, pair) => {
        const [tokenIn, tokenOut] = pair.split('-');
        const liquidity = exchangeLiquidity.get(pair) || 0;
  
        // Skip if insufficient liquidity
        if (liquidity < amountNum) return;
  
        // Calculate expected return considering slippage
        const slippage = calculateSlippage(amountNum, liquidity);
        const expectedReturn = (amountNum * price * (1 - slippage)).toString();
  
        if (parseInt(expectedReturn) > maxReturn) {
          maxReturn = parseInt(expectedReturn);
          bestStep = {
            exchange: pair.split('-')[0], // fixed this: using the exchange, not the token
            tokenIn,
            tokenOut,
            amount,
            minReturn: expectedReturn,
            route: [tokenIn, tokenOut]
          };
        }
      });
  
      return bestStep;
  
    } catch (error) {
      console.error('Error calculating optimal trade:', error);
      return null;
    }
  }
  
  export function calculateExpectedProfit({
    steps,
    estimatedGas, 
    opportunity,
    initialAmount
  }: {
    steps: TradeStep[];
    estimatedGas: number;
    opportunity: ScalpingOpportunity;
    initialAmount: string;
  }): string {
    // Safety checks
    if (steps.length === 0 || !opportunity.dexLiquidity?.routes || !opportunity.dexLiquidity.available) {
      return '0.00';
    }
  
    // Calculate final amount after all steps
    const finalAmount = Number(steps[steps.length - 1].minReturn);
    const rawProfit = finalAmount - Number(initialAmount) - estimatedGas;
  
    // Apply sophistication factors
    const baseProfit = opportunity.dexLiquidity.available * 0.001; // 0.1% base
    const routeMultiplier = Math.log(opportunity.dexLiquidity.routes + 1) * 1.2;
    const liquidityRatio = Math.min(baseProfit / rawProfit, 1);
  
    const adjustedProfit = rawProfit * liquidityRatio * routeMultiplier;
  
    return adjustedProfit.toFixed(2);
  }
    
  function calculateSlippage(amount: number, liquidity: number): number {
    // Basic slippage model: impact increases quadratically with size
    const impactRatio = amount / liquidity
    return Math.min(Math.pow(impactRatio, 2), 0.01) // Cap at 50% slippage
  }

 export function calculateRouteConfidence(
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