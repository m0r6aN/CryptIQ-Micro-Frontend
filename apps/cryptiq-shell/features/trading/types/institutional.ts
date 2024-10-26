// types/institutional.ts
export interface DarkPoolTrade {
    timestamp: number
    price: number
    volume: number
    blocks: number
    venue: string
    sentiment: 'accumulation' | 'distribution' | 'neutral'
    vwap: number
    priceImpact: number
  }
  
  export interface BlockTrade {
    timestamp: number
    price: number
    size: number
    side: 'buy' | 'sell'
    darkPool: boolean
    exchange: string
    premium: number // % from VWAP
    hidden: boolean // Ice berg order
  }
  
  export interface InstitutionalSignal {
    type: 'whale' | 'smart_money' | 'institutional' | 'market_maker'
    action: 'accumulate' | 'distribute' | 'hedge'
    confidence: number
    priceRange: {
      from: number
      to: number
    }
    timeframe: string
    volume: number
    description: string
  }