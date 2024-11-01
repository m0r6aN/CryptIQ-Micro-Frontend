// File: features/trading/utils/screenerUtils.ts

import { ethers } from 'ethers'
import { ScalpingOpportunity } from '../types/screenerTypes'
import { DEXIntegrator, LiquiditySnapshot } from '@/features/arbitrage/integrations/DEXIntegrator'
import { Route } from 'next/dist/build/swc/types'
import { BigNumber } from 'ethers'

export function calculateExpectedProfit(
  opportunity: ScalpingOpportunity
): string {
  if (!opportunity.dexLiquidity?.routes) {
    return '0.00'
  }

  // Calculate based on:
  // 1. Available liquidity
  // 2. Current spread
  // 3. Number of viable routes
  const baseProfit = opportunity.dexLiquidity.available * 0.001 // 0.1% base assumption
  const routeMultiplier = Math.log(opportunity.dexLiquidity.routes + 1) * 1.2

  const expectedProfit = baseProfit * routeMultiplier
  return expectedProfit.toFixed(2)
}

export function calculateNetProfit(
  opportunity: ScalpingOpportunity
): string {
  const expectedProfit = parseFloat(calculateExpectedProfit(opportunity))
  const gasCost = estimateGasCost(opportunity.dexLiquidity?.routes || 1)
  
  const netProfit = expectedProfit - gasCost
  return netProfit > 0 ? netProfit.toFixed(2) : '0.00'
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
    amount: BigNumber
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
      route.expectedProfit.gte(
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