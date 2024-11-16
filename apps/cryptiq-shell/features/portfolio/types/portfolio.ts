// features/portfolio/types/portfolio.ts
export interface Asset {
  id: string
  symbol: string
  name: string
  amount: number
  value: number
  price: number
  change24h: number 
}

export interface PortfolioStats {
  totalValue: number;
  totalPnl: number;
  totalPnlPercentage: number;
  dailyPnl: number;
  dailyPnlPercentage: number;
  totalAssets: number;
  highestValue: number;
  lowestValue: number;
  currency: string; // Add this line
}


export interface PortfolioState {
  assets: Asset[];
  stats: PortfolioStats;
  isLoading: boolean;
  error: string | null;
  setAssets: (assets: Asset[]) => void;
  setStats: (stats: PortfolioStats) => void;
  setLoading: (isLoading: boolean) => void; // Add this
  setError: (error: string | null) => void; // Add this
}
