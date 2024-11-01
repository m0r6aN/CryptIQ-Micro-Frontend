export interface SignalComponents {
    anomaly?: {
      price: number
      deviation: number
      timestamp: number
    }
    spike?: {
      magnitude: number
      timestamp: number
    }
    support?: {
      price: number
      volume: number
    }
  }