// types.ts
export interface CryptoData {
    symbol: string;
    price: number;
    priceChange24h: number;
    volume: number;
    volatility: number;
  }
  
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
  
  export interface SortConfig {
    key: keyof CryptoData;
    direction: 'asc' | 'desc';
  }
  
  export interface RangeFilterProps {
    value: RangeFilterValue;
    onChange: (value: RangeFilterValue) => void;
    onReset: () => void;
  }
  
  export interface TextFilterProps {
    value: string;
    onChange: (value: string) => void;
    onReset: () => void;
  }
  
  export interface ColumnConfig {
    key: keyof CryptoData;
    label: string;
    filter: React.ReactNode;
    format?: (value: number | string) => string;
    className?: (value: number | string) => string;
  }

  export type FilterValue = string | RangeFilterValue;
  export type FilterKey = keyof Filters;
  export type PartialFilters = Partial<Filters>;
  export type RequiredFilters = Required<Filters>;
  export type FilterUpdate = Pick<Filters, 'symbol' | 'price'>;