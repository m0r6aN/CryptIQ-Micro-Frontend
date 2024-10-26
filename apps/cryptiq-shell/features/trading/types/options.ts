// types/options.ts
export interface OptionContract {
  strike: number
  expiry: Date
  type: 'call' | 'put'
  bid: number
  ask: number
  last: number
  volume: number
  openInterest: number
  impliedVolatility: number
  delta: number
  gamma: number
  theta: number
  vega: number
  isWeekly: boolean
}

export interface OptionsFlow {
  timestamp: number
  contract: OptionContract
  side: 'buy' | 'sell'
  price: number
  size: number
  premium: number
  spotPrice: number
  exchange: string
  sentiment: 'bullish' | 'bearish' | 'neutral'
  unusual: boolean
  sweep: boolean
}

export interface OptionsChainData {
  calls: OptionContract[]
  puts: OptionContract[]
  spotPrice: number
  maxPain: number
  pcRatio: number
  totalCallOI: number
  totalPutOI: number
  ivSkew: number
}

export interface OptionsFlowData {
  volume: number;
  averageVolume: number;
  callVolume: number;
  putVolume: number;
  blockTrades: {
    value: number
    type: 'CALL' | 'PUT'
    strike: number
    expiry: string
  }[]
}

export interface OptionsPatterns {
  unusualVolume: boolean
  bullishFlow: boolean
  bearishFlow: boolean
  largeBlockTrades: Array<{
    value: number
    type: 'CALL' | 'PUT'
    strike: number
    expiry: string
  }>
}

export interface OptionsAlert {
  id?: string
  title: string
  description: string
  severity: "default" | "info" | "warning" | "error" 
  timestamp?: Date
  symbol?: string
  type?: "VOLUME" | "FLOW" | "BLOCK_TRADE" | "UNUSUAL_ACTIVITY"
}

export interface StrikeData {
  strike: number
  expiry: string
  volume: number
  openInterest: number
  impliedVolatility: number
  delta: number
  gamma: number
  vega: number
  theta: number
  rho: number;
}

// utils/optionsAnalysis.ts
export class OptionsAnalysis {
  static calculateMaxPain(
    calls: OptionContract[], 
    puts: OptionContract[]
  ): number {
    const strikes = [...new Set([
      ...calls.map(c => c.strike),
      ...puts.map(p => p.strike)
    ])].sort((a, b) => a - b)

    const pain = strikes.map(strike => {
      let totalPain = 0
      
      // Pain for call holders
      calls.forEach(call => {
        if (strike > call.strike) {
          totalPain += (strike - call.strike) * call.openInterest
        }
      })

      // Pain for put holders
      puts.forEach(put => {
        if (strike < put.strike) {
          totalPain += (put.strike - strike) * put.openInterest
        }
      })

      return { strike, pain: totalPain }
    })

    return pain.reduce((a, b) => 
      a.pain < b.pain ? a : b
    ).strike
  }

  static analyzeOptionsFlow(
    flows: OptionsFlow[],
    timeWindow: number = 3600000 // 1 hour
  ): {
    sentiment: 'bullish' | 'bearish' | 'neutral'
    confidence: number
    unusualActivity: OptionsFlow[]
    dominantStrikes: { strike: number, volume: number }[]
    biggestTrades: OptionsFlow[]
  } {
    const recentFlows = flows.filter(f => 
      f.timestamp > Date.now() - timeWindow
    )

    // Calculate call/put ratio by premium
    const callPremium = recentFlows.reduce((sum, flow) => 
      sum + (flow.contract.type === 'call' ? flow.premium : 0), 
      0
    )
    const putPremium = recentFlows.reduce((sum, flow) => 
      sum + (flow.contract.type === 'put' ? flow.premium : 0), 
      0
    )

    // Identify unusual activity
    const avgPremium = recentFlows.reduce((sum, flow) => 
      sum + flow.premium, 
      0
    ) / recentFlows.length

    const unusualActivity = recentFlows.filter(flow => 
      flow.premium > avgPremium * 3 || // 3x average premium
      flow.sweep || // Sweep orders across multiple exchanges
      flow.unusual // Flagged as unusual by exchange
    )

    // Calculate dominant strikes
    const strikeVolumes = recentFlows.reduce((acc, flow) => {
      const strike = flow.contract.strike
      acc[strike] = (acc[strike] || 0) + flow.size
      return acc
    }, {} as Record<number, number>)

    const dominantStrikes = Object.entries(strikeVolumes)
      .map(([strike, volume]) => ({
        strike: Number(strike),
        volume
      }))
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 5)

    return {
      sentiment: callPremium > putPremium * 1.5 ? 'bullish' :
                putPremium > callPremium * 1.5 ? 'bearish' :
                'neutral',
      confidence: Math.abs(callPremium - putPremium) / (callPremium + putPremium),
      unusualActivity,
      dominantStrikes,
      biggestTrades: recentFlows
        .sort((a, b) => b.premium - a.premium)
        .slice(0, 10)
    };
  } 
}