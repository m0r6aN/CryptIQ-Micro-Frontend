// utils/orderFlowAnalysis.ts
export class OrderFlowAnalysis {
    static WHALE_THRESHOLD = 100000 // $100k for example
  
    static analyzeOrderFlow(
      orders: OrderFlowData[],
      timeWindow: number = 300000 // 5 minutes
    ): {
      imbalances: OrderFlowImbalance[]
      largeOrders: OrderFlowData[]
      CVD: number[] // Cumulative Volume Delta
      aggression: number // Buy vs Sell aggression ratio
    } {
      const now = Date.now()
      const recentOrders = orders.filter(o => 
        o.timestamp > now - timeWindow
      )
  
      // Calculate imbalances
      const imbalances = this.calculateImbalances(recentOrders)
  
      // Identify large orders
      const largeOrders = recentOrders.filter(o => 
        o.size === 'whale' || o.size === 'large'
      )
  
      // Calculate CVD
      const cvd = this.calculateCVD(recentOrders)
  
      // Calculate aggression ratio
      const aggression = this.calculateAggression(recentOrders)
  
      return {
        imbalances,
        largeOrders,
        CVD: cvd,
        aggression
      }
    }
  
    static calculateImbalances(
      orders: OrderFlowData[]
    ): OrderFlowImbalance[] {
      const imbalances: Record<number, OrderFlowImbalance> = {}
  
      // Group orders by price level
      orders.forEach(order => {
        const price = Math.round(order.price * 100) / 100
        if (!imbalances[price]) {
          imbalances[price] = {
            price,
            buyVolume: 0,
            sellVolume: 0,
            ratio: 0,
            delta: 0
          }
        }
  
        if (order.side === 'buy') {
          imbalances[price].buyVolume += order.volume
        } else {
          imbalances[price].sellVolume += order.volume
        }
      })
  
      // Calculate ratios and deltas
      return Object.values(imbalances).map(level => ({
        ...level,
        ratio: level.buyVolume / (level.buyVolume + level.sellVolume),
        delta: level.buyVolume - level.sellVolume
      }))
    }
  
    static calculateCVD(orders: OrderFlowData[]): number[] {
      let cvd = 0
      return orders.map(order => {
        const volume = order.side === 'buy' ? order.volume : -order.volume
        cvd += volume
        return cvd
      })
    }
  
    static calculateAggression(orders: OrderFlowData[]): number {
      const marketBuyVolume = orders.reduce((sum, order) => 
        sum + (order.side === 'buy' && order.aggressiveness === 'market' ? order.volume : 0), 
        0
      )
      const marketSellVolume = orders.reduce((sum, order) => 
        sum + (order.side === 'sell' && order.aggressiveness === 'market' ? order.volume : 0), 
        0
      )
      return marketBuyVolume / (marketBuyVolume + marketSellVolume)
    }
  }