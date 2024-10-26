// types/optionsFlow.ts
interface SmartFlowSignal {
    side: 'buy' | 'sell'
    strike: number
    expiry: Date
    premium: number
    openInterest: number
    volume: number
    type: 'call' | 'put'
    spotReference: number
    ivPercentile: number
    priceAction: {
      spotMomentum: number
      volumeProfile: number[]
      preMarketGap: number
      recentHighLow: { high: number; low: number }
    }
    volatilityProfile: {
      skewScore: number
      termStructure: number[]
      ivRank: number
      ivPercentile: number
    }
    marketMaking: {
      marketWidth: number
      depth: number
      imbalance: number
    }
    optionsActivity: {
      putCallRatio: number
      volumeOIRatio: number
      blockTrades: number
      unusualActivity: boolean
    }
    sentiment: {
      score: number
      confidence: number
      signals: string[]
    }
  }