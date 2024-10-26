import { InsightData, Position } from "@/features/shared/types/common"
import { OrderType, PriceData, Signal } from "./trading"

// Props Interfaces
export interface SignalPanelProps {
    signals: Signal[]
    onSignalClick?: (signal: Signal) => void
    isLoading?: boolean
  }
  
  export interface ActivePositionsProps {
    positions: Position[]
    onPositionSelect?: (position: Position) => void
    onPositionClose?: (positionId: string) => void
    isLoading?: boolean
  }
  
  export interface OrderFormProps {
    type: OrderType['type']  // Use the discriminated union type
    onSubmit: (order: OrderType) => Promise<void>
    isSubmitting: boolean
    error: string | null
  }
  
  export interface InsightCardProps {
    type: InsightData['type']
    title: string
    description: string
  }

  export interface PriceDisplayProps {  // Renamed from PriceUpdateProps
    currentPrice: number
    previousPrice: number
    decimals?: number
  }

  export interface SignalCardProps {
    signal: Signal
    priceData: PriceData[]  // Updated type name
    isExpanded: boolean
    onToggle: () => void
    onTakeSignal: (signal: Signal) => void
  }

  export interface CountdownProps {
    expiryTime: Date
    onExpired?: () => void
  }
  
  export interface SparklineProps {
    data: PriceData[]
    color: string
    height?: number
    width?: number
  }