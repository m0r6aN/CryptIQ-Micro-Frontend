// types/options.ts
export interface OptionsPatternAnalysis {
  unusualVolume: boolean
  bullishFlow: boolean
  bearishFlow: boolean
  largeBlockTrades: number
  averageIV: number
  skewTrend: 'bullish' | 'bearish' | 'neutral'
 }

 export interface OptionsFlowData {
  volume: number;
  averageVolume: number;
  callVolume: number;
  putVolume: number;
  blockTrades: Trade[]
}
 
 // utils/optionsAnalysis.ts 
 export function analyzeOptionsPatterns(
  signals: SmartFlowSignal[],
  spotPrice: number
 ): OptionsPatternAnalysis {
  // Early return if no signals
  if (!signals?.length) {
    return {
      unusualVolume: false,
      bullishFlow: false, 
      bearishFlow: false,
      largeBlockTrades: 0,
      averageIV: 0,
      skewTrend: 'neutral'
    }
  }

  const totalVolume = signals.reduce((sum, s) => sum + s.volume, 0)
  const averageVolume = totalVolume / signals.length
  
  // Calculate volumes by direction
  const {
    callBuyVolume,
    callSellVolume,
    putBuyVolume, 
    putSellVolume
  } = signals.reduce((acc, signal) => {
    if (signal.type === 'call') {
      if (signal.side === 'buy') {
        acc.callBuyVolume += signal.volume
      } else {
        acc.callSellVolume += signal.volume
      }
    } else {
      if (signal.side === 'buy') {
        acc.putBuyVolume += signal.volume  
      } else {
        acc.putSellVolume += signal.volume
      }
    }
    return acc
  }, {
    callBuyVolume: 0,
    callSellVolume: 0, 
    putBuyVolume: 0,
    putSellVolume: 0
  })
 
  // Calculate net directional flow
  const bullishVolume = callBuyVolume + putSellVolume
  const bearishVolume = putBuyVolume + callSellVolume
 
  // Analyze volatility skew
  const avgSkew = signals.reduce((sum, s) => 
    sum + s.volatilityProfile.skewScore, 0) / signals.length
 
  return {
    unusualVolume: totalVolume > averageVolume * 2,
    bullishFlow: bullishVolume > bearishVolume * 1.5,
    bearishFlow: bearishVolume > bullishVolume * 1.5,
    largeBlockTrades: signals.filter(s => 
      s.optionsActivity.blockTrades > 0).length,
    averageIV: signals.reduce((sum, s) => 
      sum + s.ivPercentile, 0) / signals.length,
    skewTrend: avgSkew > 0.5 ? 'bullish' : 
               avgSkew < -0.5 ? 'bearish' : 'neutral'
  }
 }