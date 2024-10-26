// utils/patternRecognition.ts
export interface Pattern {
  type: PatternType
  startIndex: number
  endIndex: number
  confidence: number
  direction: 'bullish' | 'bearish'
  targetPrice?: number
  stopLoss?: number
}

export type PatternType = 
  | 'head_and_shoulders'
  | 'inverse_head_and_shoulders'
  | 'double_top'
  | 'double_bottom'
  | 'triangle'
  | 'wedge'
  | 'channel'
  | 'flag'
  | 'pennant'

export class PatternRecognition {
  static detectPatterns(data: OHLCV[]): Pattern[] {
    const patterns: Pattern[] = []
    
    patterns.push(
      ...this.detectHeadAndShoulders(data),
      ...this.detectDoublePricePatterns(data),
      ...this.detectTriangles(data),
      ...this.detectChannels(data)
    )

    return this.filterOverlappingPatterns(patterns)
  }

  private static detectHeadAndShoulders(data: OHLCV[]): Pattern[] {
    const patterns: Pattern[] = []
    const pivots = this.findPivots(data)

    for (let i = 0; i < pivots.length - 4; i++) {
      // Check for left shoulder, head, right shoulder formation
      const [ls, lv, h, rv, rs] = pivots.slice(i, i + 5)
      
      // Regular H&S
      if (this.isHeadAndShoulders(ls, lv, h, rv, rs)) {
        const neckline = this.calculateNeckline(lv, rv)
        const targetPrice = h.high - (neckline.end - neckline.start)
        
        patterns.push({
          type: 'head_and_shoulders',
          startIndex: ls.index,
          endIndex: rs.index,
          confidence: this.calculatePatternConfidence(ls, lv, h, rv, rs),
          direction: 'bearish',
          targetPrice,
          stopLoss: h.high
        })
      }

      // Inverse H&S
      if (this.isInverseHeadAndShoulders(ls, lv, h, rv, rs)) {
        const neckline = this.calculateNeckline(lv, rv)
        const targetPrice = h.low + (neckline.end - neckline.start)
        
        patterns.push({
          type: 'inverse_head_and_shoulders',
          startIndex: ls.index,
          endIndex: rs.index,
          confidence: this.calculatePatternConfidence(ls, lv, h, rv, rs),
          direction: 'bullish',
          targetPrice,
          stopLoss: h.low
        })
      }
    }

    return patterns
  }

  private static detectDoublePricePatterns(data: OHLCV[]): Pattern[] {
    const patterns: Pattern[] = []
    const pivots = this.findPivots(data)

    for (let i = 0; i < pivots.length - 2; i++) {
      const [p1, valley, p2] = pivots.slice(i, i + 3)
      
      // Double Top
      if (this.isDoubleTop(p1, valley, p2)) {
        const height = Math.abs(p1.high - valley.low)
        patterns.push({
          type: 'double_top',
          startIndex: p1.index,
          endIndex: p2.index,
          confidence: this.calculateDoublePatternConfidence(p1, valley, p2),
          direction: 'bearish',
          targetPrice: valley.low - height,
          stopLoss: Math.max(p1.high, p2.high)
        })
      }

      // Double Bottom
      if (this.isDoubleBottom(p1, valley, p2)) {
        const height = Math.abs(valley.high - p1.low)
        patterns.push({
          type: 'double_bottom',
          startIndex: p1.index,
          endIndex: p2.index,
          confidence: this.calculateDoublePatternConfidence(p1, valley, p2),
          direction: 'bullish',
          targetPrice: valley.high + height,
          stopLoss: Math.min(p1.low, p2.low)
        })
      }
    }

    return patterns
  }

  private static detectTriangles(data: OHLCV[]): Pattern[] {
    const patterns: Pattern[] = []
    const windowSize = 20 // Look back period

    for (let i = windowSize; i < data.length; i++) {
      const window = data.slice(i - windowSize, i + 1)
      const highs = this.calculateTrendline(window.map(d => d.high))
      const lows = this.calculateTrendline(window.map(d => d.low))

      // Ascending Triangle
      if (highs.slope < 0.1 && lows.slope > 0.1) {
        patterns.push({
          type: 'triangle',
          startIndex: i - windowSize,
          endIndex: i,
          confidence: this.calculateTriangleConfidence(highs, lows),
          direction: 'bullish',
          targetPrice: highs.intercept + (highs.slope * windowSize)
        })
      }

      // Descending Triangle
      if (highs.slope < -0.1 && Math.abs(lows.slope) < 0.1) {
        patterns.push({
          type: 'triangle',
          startIndex: i - windowSize,
          endIndex: i,
          confidence: this.calculateTriangleConfidence(highs, lows),
          direction: 'bearish',
          targetPrice: lows.intercept + (lows.slope * windowSize)
        })
      }
    }

    return patterns
  }

  private static detectChannels(data: OHLCV[]): Pattern[] {
    const patterns: Pattern[] = []
    const windowSize = 20

    for (let i = windowSize; i < data.length; i++) {
      const window = data.slice(i - windowSize, i + 1)
      const highs = this.calculateTrendline(window.map(d => d.high))
      const lows = this.calculateTrendline(window.map(d => d.low))

      // Parallel channel detection
      if (Math.abs(highs.slope - lows.slope) < 0.1) {
        const channelHeight = Math.abs(highs.intercept - lows.intercept)
        const direction = highs.slope > 0 ? 'bullish' : 'bearish'

        patterns.push({
          type: 'channel',
          startIndex: i - windowSize,
          endIndex: i,
          confidence: this.calculateChannelConfidence(highs, lows),
          direction,
          targetPrice: direction === 'bullish' 
            ? highs.intercept + (highs.slope * windowSize)
            : lows.intercept + (lows.slope * windowSize)
        })
      }
    }

    return patterns
  }

  private static findPivots(data: OHLCV[]): any[] {
    // Implementation of pivot point detection
    // Using local maxima/minima detection with noise filtering
    return []
  }

  private static calculateTrendline(values: number[]): { slope: number, intercept: number } {
    // Linear regression implementation
    return { slope: 0, intercept: 0 }
  }

  private static calculatePatternConfidence(
    ...points: { high: number, low: number }[]
  ): number {
    // Implement confidence calculation based on:
    // - Pattern symmetry
    // - Volume confirmation
    // - Price action confirmation
    // - Historical success rate
    return 0
  }

  // ... other private helper methods
}

// Example usage:
// const patterns = PatternRecognition.detectPatterns(candleData)
// patterns.forEach(pattern => {
//   console.log(`${pattern.type} detected with ${pattern.confidence}% confidence`)
//   console.log(`Target price: ${pattern.targetPrice}`)
// })