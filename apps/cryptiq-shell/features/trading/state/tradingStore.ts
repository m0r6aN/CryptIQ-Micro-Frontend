// features/trading/state/tradingStore.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Position } from '../../shared/types/common'

// Consider adding these types to your tradingStore.ts
export interface TradingStore {
    positions: Position[]
    activeSignals: Signal[]
    setPositions: (positions: Position[]) => void
    addSignal: (signal: Signal) => void
    createOrder: (data: OrderFormData) => Promise<void>
    closePosition: (positionId: string) => Promise<void>
}

// Update your tradingStore.ts
export const useTradingStore = create<TradingStore>()((set) => ({
    positions: [],
    activeSignals: [],
    setPositions: (positions) => set({ positions }),
    addSignal: (signal) => set((state) => ({
        activeSignals: [...state.activeSignals, signal]
    })),
    createOrder: async (data) => {
        // Implement order creation logic
        try {
            const response = await fetch('/api/trading/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            
            if (!response.ok) {
                throw new Error('Failed to create order')
            }
            
            // Handle successful order creation
            const result = await response.json()
            // Update positions or other state as needed
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Failed to create order')
        }
    },
    closePosition: async (positionId) => {
        // Implement position closing logic
        try {
            const response = await fetch(`/api/trading/position/${positionId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'close' })
            })
            
            if (!response.ok) {
                throw new Error('Failed to close position')
            }
            
            // Handle successful position closure
            set((state) => ({
                positions: state.positions.filter(p => p.id !== positionId)
            }))
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Failed to close position')
        }
    }
}))

interface TradeSignal {
    id: string
    assetId: string
    type: 'entry' | 'exit'
    direction: 'long' | 'short'
    price: number
    confidence: number
    timestamp: number
    source: 'ai' | 'technical' | 'sentiment'
    metadata: Record<string, any>
}

interface TradingState {
    positions: Position[]
    activeSignals: TradeSignal[]
    selectedPositionId: string | null
    isLoading: boolean
    error: string | null
    // Actions
    setPositions: (positions: Position[]) => void
    updatePosition: (positionId: string, updates: Partial<Position>) => void
    addSignal: (signal: TradeSignal) => void
    removeSignal: (signalId: string) => void
    setSelectedPosition: (positionId: string | null) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
}

export const useTradingStore = create<TradingState>()(
    devtools(
        (set) => ({
            positions: [],
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
            setError: (error) => set({ error })
        })
    )
)

