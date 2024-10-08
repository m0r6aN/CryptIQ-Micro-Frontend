// File path: CryptIQ-Micro-Frontend/apps/cryptiq-shell/features/portfolio/components/SmartPortfolioTracker.tsx
// Real-Time Smart Portfolio Tracker

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface PortfolioData {
  asset: string;
  quantity: number;
  current_price: number;
  total_value: number;
  percentage_change: number;
}

const SmartPortfolioTracker: React.FC = () => {
  const [portfolio, setPortfolio] = useState<PortfolioData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const response = await axios.get('/api/portfolio');
        setPortfolio(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching portfolio data", error);
        setLoading(false);
      }
    };
    fetchPortfolioData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="portfolio-tracker">
      <h1>Smart Portfolio Tracker</h1>
      <table>
        <thead>
          <tr>
            <th>Asset</th>
            <th>Quantity</th>
            <th>Current Price</th>
            <th>Total Value</th>
            <th>% Change</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.map((data, index) => (
            <tr key={index}>
              <td>{data.asset}</td>
              <td>{data.quantity}</td>
              <td>${data.current_price.toFixed(2)}</td>
              <td>${data.total_value.toFixed(2)}</td>
              <td>{data.percentage_change.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SmartPortfolioTracker;
