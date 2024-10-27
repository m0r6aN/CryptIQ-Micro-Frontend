// features/trading/components/TradingInterface.tsx
import { useTradingStore } from '../state/tradingStore'
import { TradingTabs } from './TradingTabs'
import { SignalPanel } from './SignalPanel'
import { useToast } from '@/hooks/use-toast'
import AIInsights from './AIInsights'
import {  PositionId } from '@/features/shared/types/common'

import { OrderType } from './OrderForm'
import { OrderFormData, Signal } from '../types/trading'
import { ActivePositions } from '@/features/shared/components/ActivePositions'

export function TradingInterface() {
  const { toast } = useToast()
  const { 
    positions, 
    activeSignals, 
    createOrder, 
    closePosition 
  } = useTradingStore()

  const handleOrderSubmit = async (data: OrderFormData): Promise<void> => {
    try {
      await createOrder(data)
      toast({
        title: "Order Submitted",
        description: `Successfully placed ${data.type} ${data.positionSide} order`, // Changed direction to side
        variant: "default"
      })
    } catch (error) {
      toast({
        title: "Order Failed",
        description: error instanceof Error ? error.message : "Failed to place order",
        variant: "destructive"
      })
      throw error
    }
  }

  const handleSignalClick = async (signal: Signal): Promise<void> => {
    try {
      const orderData: OrderFormData = {
        type: 'market',
        symbol: signal.symbol,
        marketType: signal.marketType,
        positionSide: signal.positionSide,
        orderDirection: signal.orderDirection,
        price: signal.price,
        size: 0,
        leverage: signal.marketType === 'futures' ? 1 : undefined
      }
      
      await handleOrderSubmit(orderData)
    } catch (error) {
      console.error('Failed to handle signal:', error)
    }
  }

  const handlePositionClose = async (positionId: PositionId): Promise<void> => {
    try {
      await closePosition(positionId)
      toast({
        title: "Position Closed",
        description: "Successfully closed position",
        variant: "default"
      })
    } catch (error) {
      toast({
        title: "Error Closing Position",
        description: error instanceof Error ? error.message : "Failed to close position",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="grid grid-cols-12 gap-6 p-6">
      <div className="col-span-12 lg:col-span-8 space-y-6">
        <TradingTabs 
          defaultValue="market"
          onSubmit={handleOrderSubmit}
        />
        <ActivePositions 
          positions={positions}
          onPositionClose={handlePositionClose}
        />
      </div>
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <SignalPanel 
          signals={activeSignals}
          onSignalClick={handleSignalClick}
        />
        <AIInsights />
      </div>
    </div>
  )
}