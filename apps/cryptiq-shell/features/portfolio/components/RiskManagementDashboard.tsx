// File path: CryptIQ-Micro-Frontend/apps/cryptiq-shell/features/portfolio/components/RiskManagementDashboard.tsx
// Real-Time Trading Risk Management Dashboard

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface RiskData {
  symbol: string;
  risk_score: number;
  stop_loss: number;
  take_profit: number;
}

const RiskManagementDashboard: React.FC = () => {
  const [riskData, setRiskData] = useState<RiskData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRiskData = async () => {
      try {
        const response = await axios.get('/api/risk_management');
        setRiskData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching risk data", error);
        setLoading(false);
      }
    };
    fetchRiskData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="risk-dashboard">
      <h1>Real-Time Trading Risk Management</h1>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Risk Score</th>
            <th>Stop Loss</th>
            <th>Take Profit</th>
          </tr>
        </thead>
        <tbody>
          {riskData.map((risk, index) => (
            <tr key={index}>
              <td>{risk.symbol}</td>
              <td>{risk.risk_score}</td>
              <td>${risk.stop_loss.toFixed(2)}</td>
              <td>${risk.take_profit.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RiskManagementDashboard;
