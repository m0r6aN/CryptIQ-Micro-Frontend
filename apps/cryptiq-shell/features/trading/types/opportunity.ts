export interface Opportunity {
    id: number;
    symbol: string;
    buyPressure: number;
    impact: number;
    sentiment: string;
    depth: {
      bids: { price: number; volume: number }[];
      asks: { price: number; volume: number }[];
    };
  }