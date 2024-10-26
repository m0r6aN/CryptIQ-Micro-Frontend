// CryptoScreener.tsx
import React, { useState, useEffect } from 'react';

import { ArrowUpDown, ArrowUp, ArrowDown, X } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import type {
  CryptoData,
  Filters,
  SortConfig,
  RangeFilterProps,
  TextFilterProps,
  ColumnConfig,
  RangeFilterValue
} from '@/lib/types';



const RangeFilter: React.FC<RangeFilterProps> = ({ value, onChange, onReset }) => (
  <div className="flex flex-col gap-2 p-2 min-w-[200px]">
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium">Range Filter</span>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={onReset}
        className="h-6 w-6 p-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
    <div className="flex gap-2 items-center">
      <Input
        type="number"
        placeholder="Min"
        value={value.min}
        onChange={(e) => onChange({ ...value, min: e.target.value })}
        className="w-20"
      />
      <span>to</span>
      <Input
        type="number"
        placeholder="Max"
        value={value.max}
        onChange={(e) => onChange({ ...value, max: e.target.value })}
        className="w-20"
      />
    </div>
  </div>
);

const TextFilter: React.FC<TextFilterProps> = ({ value, onChange, onReset }) => (
  <div className="flex flex-col gap-2 p-2 min-w-[200px]">
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium">Text Filter</span>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={onReset}
        className="h-6 w-6 p-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
    <Input
      type="text"
      placeholder="Search..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const CryptoScreener: React.FC = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ 
    key: 'volume', 
    direction: 'desc' 
  });
  
  const [filters, setFilters] = useState<Filters>({
    symbol: '',
    price: { min: '', max: '' },
    priceChange24h: { min: '', max: '' },
    volume: { min: '', max: '' },
    volatility: { min: '', max: '' },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/crypto/market-data');
        const data: CryptoData[] = await response.json();
        setCryptoData(data);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSort = (key: keyof CryptoData) => {
    setSortConfig((current: { key: string | number | symbol; direction: string; }) => ({
      key,
      direction: 
        current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const filterData = (data: CryptoData[]): CryptoData[] => {
    return data.filter((coin) => {
      // Text filter for symbol
      if (filters.symbol && !coin.symbol.toLowerCase().includes(filters.symbol.toLowerCase())) {
        return false;
      }

      // Range filters
      if (filters.price.min && coin.price < Number(filters.price.min)) return false;
      if (filters.price.max && coin.price > Number(filters.price.max)) return false;

      if (filters.priceChange24h.min && coin.priceChange24h < Number(filters.priceChange24h.min)) return false;
      if (filters.priceChange24h.max && coin.priceChange24h > Number(filters.priceChange24h.max)) return false;

      if (filters.volume.min && coin.volume < Number(filters.volume.min)) return false;
      if (filters.volume.max && coin.volume > Number(filters.volume.max)) return false;

      if (filters.volatility.min && coin.volatility < Number(filters.volatility.min)) return false;
      if (filters.volatility.max && coin.volatility > Number(filters.volatility.max)) return false;

      return true;
    });
  };

  const sortData = (data: CryptoData[]): CryptoData[] => {
    return [...data].sort((a, b) => {
      const multiplier = sortConfig.direction === 'asc' ? 1 : -1;
      if (sortConfig.key === 'symbol') {
        return multiplier * a.symbol.localeCompare(b.symbol);
      }
      return (a[sortConfig.key] - b[sortConfig.key]) * multiplier;
    });
  };

  const processedData = sortData(filterData(cryptoData));

  const getSortIcon = (key: keyof CryptoData) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="h-4 w-4" />;
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />;
  };

  const resetFilter = (key: keyof Filters) => {
    setFilters((prev: Filters) => ({
      ...prev,
      [key]: typeof prev[key] === 'string' ? '' : { min: '', max: '' }
    }));
  };

  const columnConfig: ColumnConfig[] = [
    {
      key: 'symbol',
      label: 'Symbol',
      filter: (
        <TextFilter
          value={filters.symbol}
          onChange={(value: any) => setFilters((prev: any) => ({ ...prev, symbol: value }))}
          onReset={() => resetFilter('symbol')}
        />
      ),
    },
    {
      key: 'price',
      label: 'Price',
      filter: (
        <RangeFilter
          value={filters.price}
          onChange={(value: any) => setFilters((prev: any) => ({ ...prev, price: value }))}
          onReset={() => resetFilter('price')}
        />
      ),
      format: (value: string | number) => `$${Number(value).toFixed(4)}`,
    },
    {
      key: 'priceChange24h',
      label: '24h Change',
      filter: (
        <RangeFilter
          value={filters.priceChange24h}
          onChange={(value: any) => setFilters((prev: any) => ({ ...prev, priceChange24h: value }))}
          onReset={() => resetFilter('priceChange24h')}
        />
      ),
      format: (value: string | number) => `${Number(value).toFixed(2)}%`,
      className: (value: string | number) => Number(value) >= 0 ? 'text-green-500' : 'text-red-500',
    },
    {
      key: 'volume',
      label: 'Volume',
      filter: (
        <RangeFilter
          value={filters.volume}
          onChange={(value: any) => setFilters((prev: any) => ({ ...prev, volume: value }))}
          onReset={() => resetFilter('volume')}
        />
      ),
      format: (value: string | number) => `${(Number(value) / 1000000).toFixed(2)}M`,
    },
    {
      key: 'volatility',
      label: 'Volatility',
      filter: (
        <RangeFilter
          value={filters.volatility}
          onChange={(value: any) => setFilters((prev: any) => ({ ...prev, volatility: value }))}
          onReset={() => resetFilter('volatility')}
        />
      ),
      format: (value: string | number) => `${Number(value).toFixed(2)}%`,
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Crypto Screener for Scalping</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                {columnConfig.map(({ key, label, filter }) => (
                  <th key={key} className="p-2 text-left">
                    <div className="flex items-center gap-2">
                      <div
                        className="cursor-pointer flex items-center gap-1"
                        onClick={() => handleSort(key)}
                      >
                        {label} {getSortIcon(key)}
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <span className="sr-only">Filter {label}</span>
                            {filters[key] && 
                             ((typeof filters[key] === 'string' && filters[key]) || 
                              ((filters[key] as RangeFilterValue).min || (filters[key] as RangeFilterValue).max)) ? (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            ) : (
                              <div className="w-2 h-2 border border-gray-500 rounded-full" />
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start">
                          {filter}
                        </PopoverContent>
                      </Popover>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {processedData.map((coin) => (
                <tr key={coin.symbol} className="border-b border-gray-700 hover:bg-gray-800">
                  {columnConfig.map(({ key, format, className }) => (
                    <td 
                      key={key} 
                      className={`p-2 ${className ? className(coin[key]) : ''}`}
                    >
                      {format ? format(coin[key]) : coin[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoScreener;