// hooks/use-crypto-filters.ts
import { useState, useCallback, useMemo } from 'react';

import { applyFilters, getDefaultFilters, isRangeFilter, isValidRange } from '@/components/Screeners/CryptoScreener/utils';

import type { 
  Filters, 
  FilterKey, 
  CryptoData, 
  SortConfig 
} from '@/components/Screeners/CryptoScreener/types';

interface UseCryptoFiltersReturn {
  filters: Filters;
  sortConfig: SortConfig;
  updateFilter: <T extends FilterKey>(key: T, value: Filters[T]) => void;
  resetFilter: (key: FilterKey) => void;
  resetAllFilters: () => void;
  setSortConfig: (config: SortConfig) => void;
  processData: (data: CryptoData[]) => CryptoData[];
  isFiltered: boolean;
}

export const useCryptoFilters = (
  initialFilters: Filters = getDefaultFilters()
): UseCryptoFiltersReturn => {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'volume',
    direction: 'desc'
  });

  const updateFilter = useCallback(<T extends FilterKey>(
    key: T, 
    value: Filters[T]
  ): void => {
    if (isRangeFilter(value) && !isValidRange(value)) {
      console.warn('Invalid range value');
      return;
    }
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const resetFilter = useCallback((key: FilterKey): void => {
    setFilters(prev => ({
      ...prev,
      [key]: typeof prev[key] === 'string' ? '' : { min: '', max: '' }
    }));
  }, []);

  const resetAllFilters = useCallback((): void => {
    setFilters(getDefaultFilters());
  }, []);

  const processData = useCallback((data: CryptoData[]): CryptoData[] => {
    // First apply filters
    let processedData = applyFilters(data, filters);

    // Then sort
    processedData = [...processedData].sort((a, b) => {
      const multiplier = sortConfig.direction === 'asc' ? 1 : -1;
      if (sortConfig.key === 'symbol') {
        return multiplier * a.symbol.localeCompare(b.symbol);
      }
      return (a[sortConfig.key] - b[sortConfig.key]) * multiplier;
    });

    return processedData;
  }, [filters, sortConfig]);

  const isFiltered = useMemo(() => {
    return Object.entries(filters).some(([_, value]) => {
      if (typeof value === 'string') return value !== '';
      return value.min !== '' || value.max !== '';
    });
  }, [filters]);

  return {
    filters,
    sortConfig,
    updateFilter,
    resetFilter,
    resetAllFilters,
    setSortConfig,
    processData,
    isFiltered
  };
};