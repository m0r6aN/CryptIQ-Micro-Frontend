// components/Screeners/CryptoScreener/types.ts
import { ReactNode } from 'react';

export interface RangeFilterValue {
  min: string;
  max: string;
}

export interface Filters {
  symbol: string;
  price: RangeFilterValue;
  priceChange24h: RangeFilterValue;
  volume: RangeFilterValue;
  volatility: RangeFilterValue;
}

export type FilterKey = keyof Filters;
export type FilterValue = string | RangeFilterValue;
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: keyof CryptoData;
  direction: SortDirection;
}

export interface CryptoData {
  symbol: string;
  price: number;
  priceChange24h: number;
  volume: number;
  volatility: number;
}

export interface FilterProps {
  value: RangeFilterValue | string;
  onChange: (value: RangeFilterValue | string) => void;
  onReset: () => void;
}

export interface ColumnConfig {
  key: keyof CryptoData;
  label: string;
  filter: ReactNode;
  format?: (value: number | string) => string;
  className?: (value: number | string) => string;
}

// Utility types for the filters
export type NumericFilterKeys = Extract<FilterKey, 'price' | 'volume' | 'volatility' | 'priceChange24h'>;
export type TextFilterKeys = Extract<FilterKey, 'symbol'>;