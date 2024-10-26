// components/Screeners/CryptoScreener/utils.ts
  import type { 
    Filters, 
    CryptoData, 
    RangeFilterValue, 
    NumericFilterKeys, 
    FilterValue,
    FilterKey
  } from './types';

  // Helper function to safely convert string to number
  const safeParseFloat = (value: string): number | null => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  };

  // Type guard to check if key is numeric
  const isNumericKey = (key: keyof CryptoData): key is NumericFilterKeys => {
    return ['price', 'priceChange24h', 'volume', 'volatility'].includes(key);
  };

  export const isRangeFilter = (value: FilterValue): value is RangeFilterValue => {
    return typeof value === 'object' && value !== null && 'min' in value && 'max' in value;
  };
  
  export const isNumericFilter = (key: FilterKey): key is NumericFilterKeys => {
    return ['price', 'volume', 'volatility', 'priceChange24h'].includes(key);
  };

  // Helper to apply numeric range filter
  const applyRangeFilter = (
    value: number,
    filter: RangeFilterValue
  ): boolean => {
    const minValue = filter.min ? safeParseFloat(filter.min) : null;
    const maxValue = filter.max ? safeParseFloat(filter.max) : null;

    if (minValue !== null && value < minValue) return false;
    if (maxValue !== null && value > maxValue) return false;
    return true;
  };

  
  export const isValidRange = (value: RangeFilterValue): boolean => {
    if (!value.min && !value.max) return true;
    const min = parseFloat(value.min);
    const max = parseFloat(value.max);
    if (value.min && value.max) {
      return !isNaN(min) && !isNaN(max) && min <= max;
    }
    return (!value.min || !isNaN(min)) && (!value.max || !isNaN(max));
  };
  
  export const formatValue = (value: number, type: keyof CryptoData): string => {
    switch (type) {
      case 'price':
        return `$${value.toFixed(4)}`;
      case 'volume':
        return `${(value / 1000000).toFixed(2)}M`;
      case 'volatility':
      case 'priceChange24h':
        return `${value.toFixed(2)}%`;
      default:
        return String(value);
    }
  };
  
  export const getDefaultFilters = () => ({
    symbol: '',
    price: { min: '', max: '' },
    priceChange24h: { min: '', max: '' },
    volume: { min: '', max: '' },
    volatility: { min: '', max: '' },
  });
  
  export const applyFilters = (data: CryptoData[], filters: Filters): CryptoData[] => {
    return data.filter(coin => {
      // Symbol text filter
      if (filters.symbol && !coin.symbol.toLowerCase().includes(filters.symbol.toLowerCase())) {
        return false;
      }
  
      // Define numeric filters with explicit types
      const numericFilters: [NumericFilterKeys, RangeFilterValue][] = [
        ['price', filters.price],
        ['priceChange24h', filters.priceChange24h],
        ['volume', filters.volume],
        ['volatility', filters.volatility]
      ];
  
      // Apply numeric filters
      return numericFilters.every(([key, filter]) => {
        if (!isNumericKey(key)) return true;
        const value = coin[key];
        return applyRangeFilter(value, filter);
      });
    });
  };