export type OHLCV = {
    timestamp: number
    open: number
    high: number
    low: number
    close: number
    volume: number
  }
  
  export interface IndicatorValue {
    timestamp: number
    value: number | number[]
    meta?: Record<string, any>
  }
  
  export class TechnicalAnalysis {
    // SMA calculation
    static calculateSMA(data: number[], period: number): number[] {
      const sma: number[] = []
      for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
          sma.push(NaN)
          continue
        }
        const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0)
        sma.push(sum / period)
      }
      return sma
    }
  
    // EMA calculation
    static calculateEMA(data: number[], period: number): number[] {
      const ema: number[] = []
      const multiplier = 2 / (period + 1)
  
      let initialSMA = 0
      for (let i = 0; i < period; i++) {
        initialSMA += data[i]
      }
      initialSMA /= period
  
      ema.push(initialSMA)
  
      for (let i = period; i < data.length; i++) {
        ema.push(
          (data[i] - ema[ema.length - 1]) * multiplier + ema[ema.length - 1]
        )
      }
  
      return Array(period - 1).fill(NaN).concat(ema)
    }
  
    // RSI calculation
    static calculateRSI(data: number[], period: number = 14): number[] {
      const rsi: number[] = []
      const changes: number[] = []
      
      // Calculate price changes
      for (let i = 1; i < data.length; i++) {
        changes.push(data[i] - data[i - 1])
      }
  
      let gains: number[] = changes.map(change => change > 0 ? change : 0)
      let losses: number[] = changes.map(change => change < 0 ? -change : 0)
  
      // Calculate average gains and losses
      for (let i = 0; i < data.length; i++) {
        if (i < period) {
          rsi.push(NaN)
          continue
        }
  
        const avgGain = gains.slice(i - period, i).reduce((a, b) => a + b) / period
        const avgLoss = losses.slice(i - period, i).reduce((a, b) => a + b) / period
  
        const RS = avgGain / avgLoss
        rsi.push(100 - (100 / (1 + RS)))
      }
  
      return rsi
    }
  
    // MACD calculation
    static calculateMACD(
      data: number[], 
      fastPeriod: number = 12, 
      slowPeriod: number = 26, 
      signalPeriod: number = 9
    ): { macd: number[], signal: number[], histogram: number[] } {
      const fastEMA = this.calculateEMA(data, fastPeriod)
      const slowEMA = this.calculateEMA(data, slowPeriod)
      
      const macdLine = fastEMA.map((fast, i) => fast - slowEMA[i])
      const signalLine = this.calculateEMA(macdLine, signalPeriod)
      const histogram = macdLine.map((macd, i) => macd - signalLine[i])
  
      return {
        macd: macdLine,
        signal: signalLine,
        histogram
      }
    }
  
    // Bollinger Bands calculation
    static calculateBollingerBands(
      data: number[], 
      period: number = 20, 
      multiplier: number = 2
    ): { upper: number[], middle: number[], lower: number[] } {
      const sma = this.calculateSMA(data, period)
      const stdDev: number[] = []
  
      // Calculate Standard Deviation
      for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
          stdDev.push(NaN)
          continue
        }
  
        const periodSlice = data.slice(i - period + 1, i + 1)
        const mean = sma[i]
        const squaredDiffs = periodSlice.map(x => Math.pow(x - mean, 2))
        const variance = squaredDiffs.reduce((a, b) => a + b) / period
        stdDev.push(Math.sqrt(variance))
      }
  
      return {
        upper: sma.map((middle, i) => middle + (multiplier * stdDev[i])),
        middle: sma,
        lower: sma.map((middle, i) => middle - (multiplier * stdDev[i]))
      }
    }
  
    // Volume Profile calculation
    static calculateVolumeProfile(
      data: OHLCV[], 
      levels: number = 12
    ): { price: number, volume: number }[] {
      const allPrices = data.reduce((acc, candle) => {
        const range = (candle.high - candle.low) / levels
        const volumePerLevel = candle.volume / levels
        
        for (let i = 0; i < levels; i++) {
          const price = candle.low + (range * i)
          acc.push({ price, volume: volumePerLevel })
        }
        return acc
      }, [] as { price: number, volume: number }[])
  
      // Group by price levels
      const grouped = allPrices.reduce((acc, { price, volume }) => {
        const key = Math.round(price * 100) / 100
        acc[key] = (acc[key] || 0) + volume
        return acc
      }, {} as Record<number, number>)
  
      return Object.entries(grouped)
        .map(([price, volume]) => ({
          price: Number(price),
          volume
        }))
        .sort((a, b) => a.price - b.price)
    }
  
    // Fibonacci Retracement levels
    static calculateFibonacciLevels(high: number, low: number): number[] {
      const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1]
      const range = high - low
      return levels.map(level => high - (range * level))
    }
  
    // Pivot Points calculation
    static calculatePivotPoints(
      high: number, 
      low: number, 
      close: number
    ): { 
      pp: number, 
      r1: number, 
      r2: number, 
      r3: number, 
      s1: number, 
      s2: number, 
      s3: number 
    } {
      const pp = (high + low + close) / 3
      const range = high - low
  
      return {
        pp,
        r1: pp * 2 - low,
        r2: pp + range,
        r3: pp + range * 2,
        s1: pp * 2 - high,
        s2: pp - range,
        s3: pp - range * 2
      }
    }
  }