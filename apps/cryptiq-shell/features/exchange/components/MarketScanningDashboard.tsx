// File path: CryptIQ-Micro-Frontend/apps/cryptiq-shell/features/exchange/components/MarketScanningDashboard.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';

const Line = dynamic(() => import('react-chartjs-2').then(mod => mod.Line), { ssr: false });

interface CoinMarketData {
    id: string;
    name: string;
    symbol: string;
    quote: {
        USD: {
            price: number;
        };
    };
}

interface CoinSocialData {
    id: string;
    name: string;
    sentence_count: number;
}

interface MarketScanningResponse {
    market_data: {
        data: CoinMarketData[];
    };
    social_data: {
        data: CoinSocialData[];
    };
}

const MarketScanningDashboard: React.FC = () => {
    const [marketData, setMarketData] = useState<CoinMarketData[] | null>(null);
    const [socialData, setSocialData] = useState<CoinSocialData[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [filter, setFilter] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<MarketScanningResponse>('/market_scanning');
                setMarketData(response.data.market_data.data);
                setSocialData(response.data.social_data.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(event.target.value);
    };

    const handleSortOrderChange = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const filteredMarketData = marketData?.filter((coin) =>
        coin.name.toLowerCase().includes(filter.toLowerCase())
    );

    const sortedMarketData = filteredMarketData?.sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.quote.USD.price - b.quote.USD.price;
        } else {
            return b.quote.USD.price - a.quote.USD.price;
        }
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="market-dashboard">
            <h1>Real-Time Market Scanning Dashboard</h1>
            <div className="controls">
                <input
                    type="text"
                    placeholder="Filter by coin name"
                    value={filter}
                    onChange={handleFilterChange}
                />
                <button onClick={handleSortOrderChange}>
                    Sort by Price ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
                </button>
            </div>

            <div className="market-data-section">
                <h2>Market Data</h2>
                {sortedMarketData ? (
                    <ul>
                        {sortedMarketData.map((coin) => (
                            <li key={coin.id}>
                                {coin.name} ({coin.symbol}): ${coin.quote.USD.price.toFixed(2)}
                                <button className="trade-button">Trade Now</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No market data available</p>
                )}
            </div>

            <div className="social-data-section">
                <h2>Social Sentiment Data</h2>
                {socialData ? (
                    <ul>
                        {socialData.map((coin) => (
                            <li key={coin.id}>
                                {coin.name}: {coin.sentence_count} mentions
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No social data available</p>
                )}
            </div>

            <div className="chart-section">
                <h2>Price Trend</h2>
                {marketData ? (
                    <Line
                        data={{
                            labels: marketData.map((coin) => coin.name),
                            datasets: [
                                {
                                    label: 'Price in USD',
                                    data: marketData.map((coin) => coin.quote.USD.price),
                                    borderColor: 'rgba(75,192,192,1)',
                                    fill: false,
                                },
                            ],
                        }}
                    />
                ) : (
                    <p>No chart data available</p>
                )}
            </div>
        </div>
    );
};

export default MarketScanningDashboard;