// File: features/trading/types/screenerTypes.ts

import { BigNumber } from 'ethers'

export interface ScalpingOpportunity {
    symbol: string
    price: number
    change24h: number
    volume: string
    volatility: number
    orderBookLevels: {
      bids: number
      asks: number
    }
    dexLiquidity?: {
      available: number
      routes: number
      bestRoute?: string[]
    }
    sentiment?: SentimentData
    whaleActivity?: WhaleData[]
    expectedProfit?: {
      min: number
      max: number
      confidence: number
    }
  }
  
  export interface WhaleData {
    address: string
    side: 'buy' | 'sell'
    value: number
    timestamp: number
    txHash: string
    liquidationPrice?: number
  }
  
  export interface SentimentData {
    score: number // -1 to 1
    sources: {
      social: number
      news: number
      technical: number
    }
    momentum: number
    confidence: number
    lastUpdate: number
  }
  
  export interface FlashLoanProvider {
    getFlashloan: (
      tokenAddress: string,
      amount: BigNumber,
      options?: FlashLoanOptions
    ) => Promise<FlashLoan>
    repayFlashloan: (loan: FlashLoan) => Promise<boolean>
    getMaxLoanAmount: (tokenAddress: string) => Promise<BigNumber>
  }
  
  export interface FlashLoan {
    id: string
    tokenAddress: string
    amount: BigNumber
    fee: BigNumber
    provider: string
    deadline: number
  }
  
  export interface FlashLoanOptions {
    maxFee?: number
    deadline?: number
    routerPreference?: 'aave' | 'balancer' | 'dodo'
  }