// features/trading/utils/calculations.ts
export function calculateRiskReward(
    entryPrice: number,
    stopLoss: number | undefined,
    takeProfit: number[] | undefined
  ): string {
    if (!stopLoss || !takeProfit?.length) return 'N/A'
  
    const risk = Math.abs(entryPrice - stopLoss)
    if (risk === 0) return 'N/A'
  
    // Calculate average reward from all take profit levels
    const rewards = takeProfit.map(tp => Math.abs(tp - entryPrice))
    const avgReward = rewards.reduce((sum, r) => sum + r, 0) / rewards.length
  
    const ratio = avgReward / risk
    return `1:${ratio.toFixed(2)}`
  }
  
  export function calculateStrength(signal: SmartFlowSignal): 1 | 2 | 3 | 4 | 5 {
    // Calculate strength based on multiple factors
    let score = 0
    
    // Add points for sentiment
    score += signal.sentiment.confidence * 2
  
    // Add points for unusual activity
    if (signal.optionsActivity.unusualActivity) score += 1
  
    // Add points for volume/OI ratio
    if (signal.optionsActivity.volumeOIRatio > 1.5) score += 1
  
    // Add points for IV percentile extremes
    if (signal.ivPercentile > 80 || signal.ivPercentile < 20) score += 1
  
    // Convert to 1-5 scale
    return Math.max(1, Math.min(5, Math.round(score))) as 1 | 2 | 3 | 4 | 5
  }