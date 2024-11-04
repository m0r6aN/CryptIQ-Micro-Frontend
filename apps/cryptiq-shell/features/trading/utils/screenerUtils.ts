// File: features/trading/utils/screenerUtils.ts

import { ethers } from 'ethers'
import { ScalpingOpportunity } from '../types/screenerTypes'
import { Route } from 'next/dist/build/swc/types'
import { DEXIntegrator } from 'features/arbitrage/integrations/DEXIntegrator'
import { calculateExpectedProfit } from 'features/arbitrage/scanners/utils/arbitrageUtils'


export function calculateNetProfit(opportunity: ScalpingOpportunity): string {
  try {
    // First, calculate the expected profit
    const expectedProfit = parseFloat(calculateExpectedProfit({
      steps: opportunity.executionSteps || [],  // Make sure steps are passed in
      estimatedGas: estimateGasCost(opportunity.dexLiquidity?.routes || 1), // Pass in estimated gas cost
      opportunity,
      initialAmount: opportunity.executionSteps ? opportunity.executionSteps[0].amount : '0' // Ensure initial amount is provided
    }));

    // Then, calculate the gas cost using the number of routes in dexLiquidity
    const gasCost = estimateGasCost(opportunity.dexLiquidity?.routes || 1);
    
    // Calculate net profit by subtracting the gas cost from expected profit
    const netProfit = expectedProfit - gasCost;
    
    // Return net profit as a string formatted to 2 decimal places or '0.00' if negative
    return netProfit > 0 ? netProfit.toFixed(2) : '0.00';
    
  } catch (error) {
    console.error('Error calculating net profit:', error);
    return '0.00';  // Fail-safe return
  }
}


export function estimateGasCost(
  numberOfRoutes: number,
  gasPrice: number = 50 // Default 50 gwei
): number {
  // Base gas cost for a swap
  const baseGasCost = 150000
  
  // Additional gas for each extra route
  const routeGasCost = 80000
  
  const totalGas = baseGasCost + (routeGasCost * (numberOfRoutes - 1))
  
  // Convert to ETH cost
  const ethCost = (totalGas * gasPrice * 1e-9)
  
  // Convert to USD (assuming ETH price of $2000 - should be dynamic)
  return ethCost * 2000
}

export async function getViableRoutes(
  dexIntegrator: DEXIntegrator,
  params: {
    tokenIn: string
    tokenOut: string
    amount: bigint
    minProfit?: number
  }
): Promise<Route[]> {
  const routes: Route[] = []

  // Get liquidity snapshots from all DEXes
  const snapshots = await dexIntegrator.getLiquiditySnapshots()

  // Find viable paths through DEXes
  for (const snapshot of snapshots) {
    const dexRoutes = await findRoutesInDex(
      snapshot,
      params.tokenIn,
      params.tokenOut,
      params.amount
    )

    routes.push(...dexRoutes)
  }

  // Filter by minimum profit if specified
  if (params.minProfit) {
    return routes.filter(route => 
      route.gte(
        ethers.utils.parseUnits(params.minProfit.toString(), 6)
      )
    )
  }

  return routes.sort((a, b) => 
    b.expectedProfit.sub(a.expectedProfit).gt(0) ? 1 : -1
  )
}

async function findRoutesInDex(
  snapshot: LiquiditySnapshot,
  tokenIn: string,
  tokenOut: string,
  amount: BigNumber
): Promise<Route[]> {
  const routes: Route[] = []
  
  // Find direct routes
  const directPairs = snapshot.pairs.filter(pair =>
    (pair.tokenIn === tokenIn && pair.tokenOut === tokenOut) ||
    (pair.tokenIn === tokenOut && pair.tokenOut === tokenIn)
  )

  // Find multi-hop routes (up to 3 hops)
  const multiHopRoutes = await findMultiHopRoutes(
    snapshot.pairs,
    tokenIn,
    tokenOut,
    amount,
    3
  )

  return [...directPairs, ...multiHopRoutes]
    .filter(route => route.liquidity.gte(amount))
    .map(route => ({
      ...route,
      expectedProfit: calculateRouteProfit(route, amount)
    }))
}