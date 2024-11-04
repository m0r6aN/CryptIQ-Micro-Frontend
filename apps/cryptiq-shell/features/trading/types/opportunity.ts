export interface MarketDepth {
  bids: { price: number; volume: number }[];
  asks: { price: number; volume: number }[];
}

export interface Opportunity {
  id: number;
  timestamp: Date;
  pair: string;
  
  // Arbitrage specific
  buyExchange: string;
  sellExchange: string;
  profitPercent: number;
  estimatedGas: number;
  
  // Market microstructure
  buyPressure: number;
  marketImpact: number;
  sentiment: string;
  depth: MarketDepth;

  // Execution details
  isExecutable: boolean;
  confidence: number;
  reason?: string; // If not executable, why?
  
  // Real-time metrics
  liquidityScore: number;
  volumeProfile: {
    buyExchange: number;
    sellExchange: number;
    last24h: number;
  };
}