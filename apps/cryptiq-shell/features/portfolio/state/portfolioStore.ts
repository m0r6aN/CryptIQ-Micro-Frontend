import { create } from 'zustand'
import { Asset, PortfolioStats, PortfolioState } from '../types/portfolio'

const initialStats: PortfolioStats = {
    totalValue: 0,
    totalPnl: 0,
    totalPnlPercentage: 0,
    dailyPnl: 0,
    dailyPnlPercentage: 0,
    totalAssets: 0,
    highestValue: 0,
    lowestValue: 0,
    currency: 'USD'
  }

  export const usePortfolioStore = create<PortfolioState>((set) => ({
    assets: [],
    stats: {
      totalValue: 0,
      totalPnl: 0,
      totalPnlPercentage: 0,
      dailyPnl: 0,
      dailyPnlPercentage: 0,
      totalAssets: 0, // Added
      highestValue: 0, // Added
      lowestValue: 0, // Added
      currency: 'USD', 
    },
    isLoading: false,
    error: null,
  
    setAssets: (assets) => set({ assets }),
    setStats: (stats) => set({ stats }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
  }));
  
  
