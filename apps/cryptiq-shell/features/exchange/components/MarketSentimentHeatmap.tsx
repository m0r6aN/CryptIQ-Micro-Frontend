// File path: CryptIQ-Micro-Frontend/apps/cryptiq-shell/features/exchange/components/MarketSentimentHeatmap.tsx
// Market Sentiment Heatmap

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { HeatMapGrid } from 'react-grid-heatmap';

interface SentimentData {
  coin: string;
  sentiment_score: number;
}

const MarketSentimentHeatmap: React.FC = () => {
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [heatmapData, setHeatmapData] = useState<number[][]>([]);

  useEffect(() => {
    const fetchSentimentData = async () => {
      try {
        const response = await axios.get('/api/market_sentiment');
        setSentimentData(response.data);
        
        const coins = response.data.map((data: SentimentData) => data.coin);
        setLabels(coins);

        const sentimentScores = response.data.map((data: SentimentData) => data.sentiment_score);
        setHeatmapData([sentimentScores]);  // Use sentiment scores as heatmap values
      } catch (error) {
        console.error("Error fetching sentiment data", error);
      }
    };

    fetchSentimentData();
  }, []);

  return (
    <div>
      <h2>Market Sentiment Heatmap</h2>
      <HeatMapGrid
        data={heatmapData}
        xLabels={labels}
        yLabels={["Sentiment Score"]}
        cellHeight="50px"
        square
        cellStyle={(x, y, ratio) => ({
          background: `rgb(255, 70, 70, ${ratio})`,
          fontSize: "15px",
        })}
        cellRender={(x, y, value) => value && <div>{value.toFixed(2)}</div>}
      />
    </div>
  );
};

export default MarketSentimentHeatmap;
