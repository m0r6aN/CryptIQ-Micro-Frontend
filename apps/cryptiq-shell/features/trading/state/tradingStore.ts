// features/trading/state/tradingStore.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Position } from '../../shared/types/common'
import type { 
    OrderFormData, 
    Signal, 
    MarketOrder,
    LimitOrder,
    OCOOrder,
    TrailingStopOrder,
    Order 
   } from '../types/trading'


export interface TradingState {
    positions: Position[]
    pendingOrders: Order[]
    activeSignals: Signal[]
    selectedPositionId: string | null
    isLoading: boolean
    error: string | null
    
     // Actions
     setPositions: (positions: Position[]) => void
     updatePosition: (positionId: string, updates: Partial<Position>) => void
     addSignal: (signal: Signal) => void
     removeSignal: (signalId: string) => void
     setSelectedPosition: (positionId: string | null) => void
     setLoading: (loading: boolean) => void
     setError: (error: string | null) => void
     createOrder: (data: OrderFormData) => Promise<void>
     createMarketOrder: (order: MarketOrder) => Promise<void>
     createLimitOrder: (order: LimitOrder) => Promise<void>
     createOCOOrder: (order: OCOOrder) => Promise<void>
     createTrailingStopOrder: (order: TrailingStopOrder) => Promise<void>
     modifyOrder: (orderId: string, updates: Partial<Order>) => Promise<void>
     cancelOrder: (orderId: string) => Promise<void>
     closePosition: (positionId: string) => Promise<void>
  }

  export const useTradingStore = create<TradingState>()(
    devtools(
      (set, get) => ({
        positions: [],
        pendingOrders: [],
        activeSignals: [],
        selectedPositionId: null,
        isLoading: false,
        error: null,
  
        setPositions: (positions) => set({ positions }),
        updatePosition: (positionId, updates) => set((state) => ({
          positions: state.positions.map(position =>
            position.id === positionId ? { ...position, ...updates } : position
          )
        })),
        addSignal: (signal) => set((state) => ({
          activeSignals: [...state.activeSignals, signal]
        })),
        removeSignal: (signalId) => set((state) => ({
          activeSignals: state.activeSignals.filter(signal => signal.id !== signalId)
        })),
        setSelectedPosition: (positionId) => set({ selectedPositionId: positionId }),
        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error }),
  
        createOrder: async (data: OrderFormData) => {
            set({ isLoading: true, error: null })
            try {
              switch (data.type) {
                case 'market':
                  await get().createMarketOrder(data as MarketOrder)
                  break
                case 'limit':
                  await get().createLimitOrder(data as LimitOrder)
                  break
                case 'oco':
                  await get().createOCOOrder(data as OCOOrder)
                  break
                case 'trailing_stop':
                  await get().createTrailingStopOrder(data as TrailingStopOrder)
                  break
                default:
                  throw new Error(`Unsupported order type: ${data.type}`)
              }
            } catch (error) {
              set({ error: error instanceof Error ? error.message : 'Failed to create order' })
              throw error
            } finally {
              set({ isLoading: false })
            }
          },
     
          createMarketOrder: async (order: MarketOrder) => {
            const response = await fetch('/api/orders/market', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...order,
                timestamp: Date.now()
              })
            })
            
            if (!response.ok) throw new Error('Failed to create market order')
            
            const newPosition = await response.json()
            set((state) => ({
              positions: [...state.positions, newPosition]
            }))
          },
     
          createLimitOrder: async (order: LimitOrder) => {
            const response = await fetch('/api/orders/limit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...order,
                timestamp: Date.now()
              })
            })
            
            if (!response.ok) throw new Error('Failed to create limit order')
            
            // Add to pending orders
            const newOrder = await response.json()
            set((state) => ({
                pendingOrders: [...(state.pendingOrders || []), newOrder]
              }));
          },
     
          createOCOOrder: async (order: OCOOrder) => {
            const response = await fetch('/api/orders/oco', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...order,
                timestamp: Date.now()
              })
            })
            
            if (!response.ok) throw new Error('Failed to create OCO order')
            
            const newOrders = await response.json()
            set((state) => ({
              pendingOrders: [...(state.pendingOrders || []), ...newOrders]
            }))
          },
     
          createTrailingStopOrder: async (order: TrailingStopOrder) => {
            const response = await fetch('/api/orders/trailing-stop', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...order,
                    timestamp: Date.now()
                })
            })
            
            if (!response.ok) throw new Error('Failed to create trailing stop order')
            
            const newOrder = await response.json()
            set((state) => ({
                pendingOrders: [...(state.pendingOrders || []), newOrder]
            }))
        },

        modifyOrder: async (orderId: string, updates: Partial<Order>) => {
            const response = await fetch(`/api/orders/${orderId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updates)
            })
            
            if (!response.ok) throw new Error('Failed to modify order')
            
            const updatedOrder = await response.json()
            set((state) => ({
              pendingOrders: state.pendingOrders.map(order =>
                order.id === orderId ? { ...order, ...updatedOrder } : order
              )
            }))
          },
          
          cancelOrder: async (orderId: string) => {
            const response = await fetch(`/api/orders/${orderId}`, {
              method: 'DELETE'
            })
            
            if (!response.ok) throw new Error('Failed to cancel order')
            
            set((state) => ({
              pendingOrders: state.pendingOrders.filter(order => order.id !== orderId)
            }))
          },
  
        closePosition: async (positionId: string) => {
          set({ isLoading: true, error: null })
          try {
            // Implement position closing logic here
            const response = await fetch(`/api/positions/${positionId}/close`, {
              method: 'POST'
            })
            
            if (!response.ok) throw new Error('Failed to close position')
            
            // Update positions after successful close
            set((state) => ({
              positions: state.positions.filter(p => p.id !== positionId)
            }))
          } catch (error) {
            set({ error: error instanceof Error ? error.message : 'Failed to close position' })
            throw error
          } finally {
            set({ isLoading: false })
          }
        }
      })
    )
  )

