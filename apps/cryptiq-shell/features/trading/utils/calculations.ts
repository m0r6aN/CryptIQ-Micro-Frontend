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
  