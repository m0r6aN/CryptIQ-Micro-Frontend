import { OrderSide } from "@/features/trading/components/OrderForm"

// features/shared/types/common.ts
export interface Asset {
    id: string
    symbol: string
    name: string
    price: number
    quantity: number
    value: number
    change24h: number
    allocation: number
}

export type PositionId = string
export type AssetId = string

export interface Position {
    id: string
    symbol: string
    side: OrderSide
    size: number
    leverage: number
    entryPrice: number
    currentPrice: number
    pnl: number
    pnlPercent: number
    liquidationPrice?: number
    stopLoss?: number
  }

export interface PortfolioStats {
    totalValue: number
    totalPnl: number
    totalPnlPercentage: number
    dailyPnl: number
    dailyPnlPercentage: number
    highestValue: number
    lowestValue: number
}

export interface InsightData {
    type: 'warning' | 'info' | 'success'
    title: string
    description: string
    timestamp: number
    priority: number
    metadata?: Record<string, any>
}
