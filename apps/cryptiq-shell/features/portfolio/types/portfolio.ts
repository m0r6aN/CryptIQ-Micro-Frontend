import { Position } from "@/features/shared/types/common"

// types/portfolio.ts
export type PortfolioStats = {
  totalValue: number
  dailyPnl: number
  dailyPnlPercentage: number
  totalPnl: number
  totalPnlPercentage: number
}
 
export type Asset = {
  id: string
  name: string
  symbol: string      // Useful for API calls and display
  price: number       // Current price
  quantity: number    // Number of units owned
  value: number       // Total value (price * quantity)
  change24h: number   // 24-hour price change percentage
}
  
export type WebSocketMessage = {
  type: 'ASSETS_UPDATE' | 'STATS_UPDATE'
  assets?: Asset[]
  stats?: PortfolioStats
}

