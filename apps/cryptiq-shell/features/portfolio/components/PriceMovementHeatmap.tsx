// File path: CryptIQ-Micro-Frontend/apps/cryptiq-shell/features/portfolio/components/PriceMovementHeatmap.tsx
// Price Movement Heatmap Generator

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { HeatMapGrid } from 'react-grid-heatmap';

const PriceMovementHeatmap: React.FC = () => {
  const [priceData, setPriceData] = useState<number[][]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const response = await axios.get('/api/price_movements');
        setPriceData(response.data.heatmap);
        setLabels(response.data.labels);
      } catch (error) {
        console.error("Error fetching price movement data", error);
      }
    };
    fetchPriceData();
  }, []);

  return (
    <div>
      <h2>Price Movement Heatmap</h2>
      <HeatMapGrid
        data={priceData}
        xLabels={labels}
        yLabels={["BTC", "ETH", "LTC", "XRP"]}
        cellHeight="30px"
        square
      />
    </div>
  );
};

export default PriceMovementHeatmap;
