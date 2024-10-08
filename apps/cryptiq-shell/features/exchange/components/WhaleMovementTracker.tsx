// File path: CryptIQ-Micro-Frontend/apps/cryptiq-shell/features/exchange/components/WhaleMovementTracker.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

interface WhaleTransaction {
  timeStamp: string;
  from: string;
  to: string;
  value: string;
}

const WhaleMovementTracker: React.FC = () => {
  const [whaleData, setWhaleData] = useState<WhaleTransaction[] | null>(null);

  useEffect(() => {
    const fetchWhaleData = async () => {
      try {
        const response = await axios.get('/api/whale_movements');
        setWhaleData(response.data);
      } catch (error) {
        console.error("Error fetching whale data", error);
      }
    };
    fetchWhaleData();
  }, []);

  const chartData = {
    labels: whaleData ? whaleData.map(tx => new Date(parseInt(tx.timeStamp) * 1000).toLocaleString()) : [],
    datasets: [
      {
        label: 'Whale Transactions',
        data: whaleData ? whaleData.map(tx => parseFloat(tx.value)) : [],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
    ],
  };

  return (
    <div>
      <h2>Whale Movement Tracker</h2>
      {whaleData ? (
        <Line data={chartData} />
      ) : (
        <p>Loading whale movements...</p>
      )}
    </div>
  );
};

export default WhaleMovementTracker;
