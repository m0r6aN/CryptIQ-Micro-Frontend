// File path: CryptIQ-Micro-Frontend/apps/cryptiq-shell/features/portfolio/components/PortfolioRebalancer.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Portfolio {
  [asset: string]: number;
}

interface RebalancingOrder {
  asset: string;
  action: 'buy' | 'sell';
  amount: number;
}

const PortfolioRebalancer: React.FC = () => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [rebalancingOrders, setRebalancingOrders] = useState<RebalancingOrder[] | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await axios.get('/api/portfolio');
        setPortfolio(response.data);
      } catch (error) {
        console.error("Error fetching portfolio data", error);
      }
    };
    fetchPortfolio();
  }, []);

  const rebalancePortfolio = async () => {
    try {
      const response = await axios.post('/api/rebalance', { portfolio });
      setRebalancingOrders(response.data.orders);
    } catch (error) {
      console.error("Error rebalancing portfolio", error);
    }
  };

  return (
    <div>
      <h2>Portfolio Rebalancer</h2>
      {portfolio ? (
        <div>
          <h3>Current Portfolio</h3>
          <ul>
            {Object.entries(portfolio).map(([asset, value]) => (
              <li key={asset}>
                {asset}: ${value.toFixed(2)}
              </li>
            ))}
          </ul>
          <button onClick={rebalancePortfolio}>Rebalance Portfolio</button>
        </div>
      ) : (
        <p>Loading portfolio...</p>
      )}

      {rebalancingOrders && (
        <div>
          <h3>Rebalancing Orders</h3>
          <ul>
            {rebalancingOrders.map((order, index) => (
              <li key={index}>
                {order.action.toUpperCase()} {order.amount} of {order.asset}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PortfolioRebalancer;
