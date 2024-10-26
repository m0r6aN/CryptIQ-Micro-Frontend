// utils/institutionalAnalysis.ts
export class InstitutionalAnalysis {
    static readonly WHALE_THRESHOLD = 1_000_000 // $1M USD
    static readonly BLOCK_THRESHOLD = 100_000   // 100k USD
  
    static analyzeDarkPoolActivity(
      trades: DarkPoolTrade[],
      timeWindow: number = 86400000 // 24 hours
    ): {
      volumeProfile: VolumeProfile[]
      sentiment: 'bullish' | 'bearish' | 'neutral'
      keyLevels: number[]
      signals: InstitutionalSignal[]
    } {
      const recentTrades = trades.filter(t => 
        t.timestamp > Date.now() - timeWindow
      )
  
      // Analyze volume profile
      const volumeProfile = this.calculateVolumeProfile(recentTrades)
  
      // Find key price levels
      const keyLevels = this.findKeyLevels(volumeProfile)
  
      // Generate institutional signals
      const signals = this.generateSignals(recentTrades, volumeProfile, keyLevels)
  
      // Calculate overall sentiment
      const sentiment = this.calculateSentiment(recentTrades, signals)
  
      return {
        volumeProfile,
        sentiment,
        keyLevels,
        signals
      }
    }
  
    private static calculateVolumeProfile(
      trades: DarkPoolTrade[]
    ): VolumeProfile[] {
      // Group trades by price level and analyze volume distribution
      const priceMap = new Map<number, {
        volume: number
        trades: number
        accumulation: number
        distribution: number
      }>()
  
      trades.forEach(trade => {
        const price = Math.round(trade.price * 100) / 100
        const current = priceMap.get(price) || {
          volume: 0,
          trades: 0,
          accumulation: 0,
          distribution: 0
        }
  
        current.volume += trade.volume
        current.trades += trade.blocks
        if (trade.sentiment === 'accumulation') {
          current.accumulation += trade.volume
        } else if (trade.sentiment === 'distribution') {
          current.distribution += trade.volume
        }
  
        priceMap.set(price, current)
      })
  
      // Convert to array and calculate additional metrics
      return Array.from(priceMap.entries())
        .map(([price, data]) => ({
          price,
          volume: data.volume,
          trades: data.trades,
          accumulation: data.accumulation,
          distribution: data.distribution,
          ratio: data.accumulation / (data.accumulation + data.distribution),
          dominance: data.volume / trades.reduce((sum, t) => sum + t.volume, 0)
        }))
        .sort((a, b) => a.price - b.price)
    }
  
    private static findKeyLevels(
      profile: VolumeProfile[]
    ): number[] {
      // Find significant volume nodes
      const volumeThreshold = 
        Math.max(...profile.map(p => p.volume)) * 0.15 // 15% of max volume
  
      return profile
        .filter(p => p.volume > volumeThreshold)
        .map(p => p.price)
    }
  
    private static generateSignals(
      trades: DarkPoolTrade[],
      profile: VolumeProfile[],
      keyLevels: number[]
    ): InstitutionalSignal[] {
      const signals: InstitutionalSignal[] = []
  
      // Analyze institutional patterns
      this.detectAccumulation(trades, profile).forEach(signal => 
        signals.push(signal)
      )
  
      this.detectDistribution(trades, profile).forEach(signal => 
        signals.push(signal)
      )
  
      this.detectWhaleActivity(trades).forEach(signal => 
        signals.push(signal)
      )
  
      // Sort by confidence
      return signals.sort((a, b) => b.confidence - a.confidence)
    }
  
    private static detectAccumulation(
      trades: DarkPoolTrade[],
      profile: VolumeProfile[]
    ): InstitutionalSignal[] {
      const signals: InstitutionalSignal[] = []
      const timeWindows = [
        { name: '1h', ms: 3600000 },
        { name: '4h', ms: 14400000 },
        { name: '24h', ms: 86400000 }
      ]
  
      timeWindows.forEach(window => {
        const windowTrades = trades.filter(t => 
          t.timestamp > Date.now() - window.ms
        )
  
        // Calculate accumulation metrics
        const accVolume = windowTrades.reduce((sum, t) => 
          sum + (t.sentiment === 'accumulation' ? t.volume : 0), 
          0
        )
  
        const totalVolume = windowTrades.reduce((sum, t) => 
          sum + t.volume, 
          0
        )
  
        if (accVolume / totalVolume > 0.7) { // 70% accumulation
          signals.push({
            type: 'institutional',
            action: 'accumulate',
            confidence: (accVolume / totalVolume) * 100,
            timeframe: window.name,
            volume: accVolume,
            priceRange: {
              from: Math.min(...windowTrades.map(t => t.price)),
              to: Math.max(...windowTrades.map(t => t.price))
            },
            description: `Strong institutional accumulation detected over ${window.name} timeframe`
          })
        }
      })
  
      return signals
    }
  
    private static detectWhaleActivity(
      trades: DarkPoolTrade[]
    ): InstitutionalSignal[] {
      return trades
        .filter(t => t.volume > this.WHALE_THRESHOLD)
        .map(trade => ({
          type: 'whale',
          action: trade.sentiment === 'accumulation' ? 
            'accumulate' : 'distribute',
          confidence: Math.min(
            (trade.volume / this.WHALE_THRESHOLD) * 100, 
            100
          ),
          timeframe: '5m',
          volume: trade.volume,
          priceRange: {
            from: trade.price * 0.999,
            to: trade.price * 1.001
          },
          description: `Whale ${
            trade.sentiment === 'accumulation' ? 'buying' : 'selling'
          } detected at ${trade.price}`
        }))
    }
  }