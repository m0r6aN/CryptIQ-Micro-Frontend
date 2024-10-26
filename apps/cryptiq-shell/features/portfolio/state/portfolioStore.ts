// features/portfolio/state/portfolioStore.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Asset, PortfolioStats } from '../../shared/types/common'

interface PortfolioState {
    assets: Asset[]
    stats: PortfolioStats
    selectedAssetId: string | null
    isLoading: boolean
    error: string | null
    // Actions
    setAssets: (assets: Asset[]) => void
    updateAsset: (assetId: string, updates: Partial<Asset>) => void
    setStats: (stats: PortfolioStats) => void
    setSelectedAsset: (assetId: string | null) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
}

export const usePortfolioStore = create<PortfolioState>()(
    devtools(
        persist(
            (set) => ({
                assets: [],
                stats: {
                    totalValue: 0,
                    totalPnl: 0,
                    totalPnlPercentage: 0,
                    dailyPnl: 0,
                    dailyPnlPercentage: 0,
                    highestValue: 0,
                    lowestValue: 0
                },
                selectedAssetId: null,
                isLoading: false,
                error: null,

                setAssets: (assets) => set({ assets }),
                updateAsset: (assetId, updates) => set((state) => ({
                    assets: state.assets.map(asset =>
                        asset.id === assetId ? { ...asset, ...updates } : asset
                    )
                })),
                setStats: (stats) => set({ stats }),
                setSelectedAsset: (assetId) => set({ selectedAssetId: assetId }),
                setLoading: (loading) => set({ isLoading: loading }),
                setError: (error) => set({ error })
            }),
            {
                name: 'portfolio-storage'
            }
        )
    )
)