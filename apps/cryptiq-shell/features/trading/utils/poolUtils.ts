// File: features/trading/utils/poolUtils.ts

import { ethers, BigNumber } from 'ethers'
import { Provider } from '@ethersproject/providers'
import { CURVE_POOL_ABI } from '../abis/curve'
import { EventEmitter } from '../types/trading'

export interface TokenExchangeEvent {
    args: [
      string,      // buyer (address)
      BigNumber,   // sold_id (int128)
      BigNumber,   // tokens_sold (uint256)
      BigNumber,   // bought_id (int128)
      BigNumber    // tokens_bought (uint256)
    ]
  }

  export async function getPoolInfo(poolAddress: string, provider: Provider): Promise<{
    name: string
    coins: string[]
    basePool?: string
    apy: number
    totalLiquidity: string
    volume24h: string
  }> {
    const poolContract = new ethers.Contract(
      poolAddress,
      CURVE_POOL_ABI,
      provider
    )
  
    const [coins, balances, rates] = await Promise.all([
      poolContract.coins(0).catch(() => []),
      poolContract.balances(0).catch(() => []),
      poolContract.get_rates().catch(() => [])
    ])
  
    const volume24h = await get24hVolume(poolAddress, provider)
    const apy = await calculatePoolAPY(poolAddress, rates, balances, provider)
  
    return {
      name: await poolContract.name().catch(() => ''),
      coins: coins.filter((c: string) => c !== ethers.constants.AddressZero),
      totalLiquidity: balances.reduce((a: BigNumber, b: BigNumber) => a.add(b), BigNumber.from(0)).toString(),
      volume24h: volume24h.toString(),
      apy
    }
  }

async function calculatePoolAPY(
  poolAddress: string,
  rates: BigNumber[],
  balances: BigNumber[],
  provider: Provider
): Promise<number> {
  const poolContract = new ethers.Contract(
    poolAddress,
    CURVE_POOL_ABI,
    provider
  )

  try {
    // Get virtual price from a week ago
    const currentBlock = await provider.getBlock('latest')
    const blocksPerWeek = 45500 // Approximately on Ethereum
    const pastBlock = currentBlock.number - blocksPerWeek
    
    const currentVirtualPrice = await poolContract.get_virtual_price()
    const pastVirtualPrice = await poolContract.get_virtual_price({ blockTag: pastBlock })

    // Calculate APY based on virtual price change
    const priceRatio = currentVirtualPrice.mul(10000).div(pastVirtualPrice)
    const weeklyYield = priceRatio.sub(10000)
    const annualizedYield = weeklyYield.mul(52) // 52 weeks in a year

    // Additional yield from trading fees
    const dailyVolume = await get24hVolume(poolAddress, provider)
    const feeRate = await poolContract.fee().catch(() => BigNumber.from(4000000)) // Default to 0.04%
    const dailyFees = dailyVolume.mul(feeRate).div(1e10)
    const annualizedFees = dailyFees.mul(365)

    const totalBalances = balances.reduce((a, b) => a.add(b), BigNumber.from(0))
    const feeYield = annualizedFees.mul(10000).div(totalBalances)

    // Combine base yield and fee yield
    return (annualizedYield.add(feeYield).toNumber() / 100)
  } catch (error) {
    console.error('Error calculating APY:', error)
    return 0
  }
}

async function get24hVolume(
    poolAddress: string,
    provider: Provider
  ): Promise<BigNumber> {
    const poolContract = new ethers.Contract(
      poolAddress,
      CURVE_POOL_ABI,
      provider
    )
  
    // Get block number from 24 hours ago
    const currentBlock = await provider.getBlock('latest')
    const blocksPerDay = 6500 // Approximately on Ethereum
    const pastBlock = currentBlock.number - blocksPerDay
  
    try {
      // Get exchange events
      const filter = poolContract.filters.TokenExchange()
      const events = await poolContract.queryFilter(
        filter,
        pastBlock,
        currentBlock.number
      )

      const tokenExchangeEvents: TokenExchangeEvent[] = events.map(event => {
        if (event.args && event.args.length === 5) {
          const [buyer, sold_id, tokens_sold, bought_id, tokens_bought] = event.args
          return { args: [buyer, sold_id, tokens_sold, bought_id, tokens_bought] }
        }
        throw new Error('Unexpected event args structure')
      })

      // Calculate total volume from events
      const totalVolume = tokenExchangeEvents.reduce((acc, event) => {
        return acc.add(event.args[2]) // tokens_sold
      }, BigNumber.from(0))

      return totalVolume
    } catch (error) {
      console.error('Error fetching 24h volume:', error)
      return BigNumber.from(0) // Return zero in case of an error
    }
  }

// Base event emitter class
export class BaseEventEmitter implements EventEmitter {
    private listeners: { [event: string]: ((data: any) => void)[] } = {}
  
    emit(event: string, data: any): void {
      if (this.listeners[event]) {
        this.listeners[event].forEach(handler => handler(data))
      }
    }
  
    on(event: string, handler: (data: any) => void): void {
      if (!this.listeners[event]) {
        this.listeners[event] = []
      }
      this.listeners[event].push(handler)
    }
  
    off(event: string, handler: (data: any) => void): void {
      if (this.listeners[event]) {
        this.listeners[event] = this.listeners[event].filter(h => h !== handler)
      }
    }
  }