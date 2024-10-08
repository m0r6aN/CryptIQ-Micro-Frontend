// File path: CryptIQ-Micro-Frontend/apps/cryptiq-shell/features/portfolio/components/StrategyBacktesting.tsx

import React, { useState } from 'react';
import axios from 'axios';

interface BacktestResult {
  startBalance: number;
  endBalance: number;
  trades: number;
  profit: number;
  maxDrawdown: number;
}

const StrategyBacktesting: React.FC = () => {
  const [strategy, setStrategy] = useState<string>('');
  const [result, setResult] = useState<BacktestResult | null>(null);

  const runBacktest = async () => {
    try {
      const response = await axios.post('/api/backtest', { strategy });
      setResult(response.data);
    } catch (error) {
      console.error("Error running backtest", error);
    }
  };

  return (
    <div>
      <h2>Strategy Backtesting</h2>
      <select value={strategy} onChange={(e) => setStrategy(e.target.value)}>
        <option value="rsi">RSI Strategy</option>
        <option value="moving_average">Moving Average Crossover</option>
        <option value="bollinger_bands">Bollinger Bands</option>
      </select>
      <button onClick={runBacktest}>Run Backtest</button>
      {result && (
        <div>
          <h3>Backtest Results</h3>
          <p>Start Balance: ${result.startBalance}</p>
          <p>End Balance: ${result.endBalance}</p>
          <p>Number of Trades: {result.trades}</p>
          <p>Profit: ${result.profit}</p>
          <p>Max Drawdown: {result.maxDrawdown}%</p>
        </div>
      )}
    </div>
  );
};

export default StrategyBacktesting;
