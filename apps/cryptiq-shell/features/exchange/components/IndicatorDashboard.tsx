// File path: CryptIQ-Micro-Frontend/apps/cryptiq-shell/features/exchange/components/IndicatorDashboard.tsx
// Dynamic Indicator Dashboard

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface IndicatorValue {
  indicator: string;
  value: number | string;
}

const IndicatorDashboard: React.FC = () => {
  const [indicators, setIndicators] = useState<IndicatorValue[]>([]);

  useEffect(() => {
    const fetchIndicators = async () => {
      try {
        const response = await axios.get('/api/indicators');
        setIndicators(response.data);
      } catch (error) {
        console.error("Error fetching indicator data", error);
      }
    };
    fetchIndicators();
  }, []);

  return (
    <div>
      <h2>Dynamic Indicator Dashboard</h2>
      <table>
        <thead>
          <tr>
            <th>Indicator</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {indicators.map((indicator, index) => (
            <tr key={index}>
              <td>{indicator.indicator}</td>
              <td>{indicator.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IndicatorDashboard;
