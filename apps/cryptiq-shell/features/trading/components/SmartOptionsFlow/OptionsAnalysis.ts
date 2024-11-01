// features/trading/components/SmartOptionsFlow/OptionsAnalysis.ts

import { OptionsFlowData } from "../../types/options";



export function analyzeOptionsPatterns(signals: SmartFlowSignal[], spotPrice: number, data: OptionsFlowData) {
    return {
      unusualVolume: data.volume > data.averageVolume * 2,
      bullishFlow: data.callVolume > data.putVolume * 1.5,
      bearishFlow: data.putVolume > data.callVolume * 1.5,
      largeBlockTrades: data.blockTrades.filter(trade => trade.value > 100000)
    }
  }