// File path: CryptIQ-Micro-Frontend/apps/cryptiq-shell/features/exchange/components/OrderBookHeatmap.tsx
// Real-Time Order Book Heatmap Visualization

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { HeatMapGrid } from 'react-grid-heatmap';

interface OrderBook {
  price: number;
  size: number;
}

const OrderBookHeatmap: React.FC = () => {
  const [bids, setBids] = useState<OrderBook[]>([]);
  const [asks, setAsks] = useState<OrderBook[]>([]);
  const [heatmapData, setHeatmapData] = useState<number[][]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    const fetchOrderBookData = async () => {
      try {
        const response = await axios.get('/api/order_book');
        setBids(response.data.bids);
        setAsks(response.data.asks);

        const bidPrices = response.data.bids.map((bid: OrderBook) => bid.price);
        const askPrices = response.data.asks.map((ask: OrderBook) => ask.price);
        setLabels([...bidPrices, ...askPrices].map(price => price.toString()));

        const combinedData = [...response.data.bids, ...response.data.asks].map((order: OrderBook) => order.size);
        setHeatmapData([combinedData]); // Use size as heatmap value
      } catch (error) {
        console.error("Error fetching order book data", error);
      }
    };

    fetchOrderBookData();
  }, []);

  return (
    <div>
      <h2>Order Book Heatmap</h2>
      <HeatMapGrid
        data={heatmapData}
        xLabels={labels}
        yLabels={["Bids & Asks"]}
        cellHeight="50px"
        square
        cellStyle={(x, y, ratio) => ({
          background: `rgb(12, 160, 44, ${ratio})`,
          fontSize: "15px",
        })}
        cellRender={(x, y, value) => value && <div>{value}</div>}
      />
    </div>
  );
};

export default OrderBookHeatmap;
