// types/hedge.ts

export interface HedgeParams {
    type: 'buy' | 'sell' | 'hedge';
    option?: 'call' | 'put';  // For options trades
    quantity: number;         // Number of contracts or shares
    targetDelta?: number;     // Target delta for hedge adjustments
    expirationDate?: string;  // Expiry date for the option
    strikePrice?: number;     // Strike price if it’s an option
  }
  