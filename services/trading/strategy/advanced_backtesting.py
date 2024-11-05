# File path: CryptIQ-Micro-Frontend/services/trading-service/advanced_backtesting.py
"""
 Backtesting Module with Expanded Metrics
"""
import pandas as pd

def run_backtest(strategy_function, data: pd.DataFrame):
    """
    Runs a backtest on historical data using the provided strategy.
    Args:
        strategy_function: The trading strategy to backtest.
        data: Historical OHLCV data.
    """
    initial_balance = 10000
    current_balance = initial_balance
    trades = 0
    max_drawdown = 0
    peak_balance = initial_balance

    for i in range(1, len(data)):
        signal = strategy_function(data.iloc[:i])  # Run strategy on slice of data

        # Example trade execution logic
        if signal == 'buy':
            trades += 1
            current_balance *= 1 + (data['close'].iloc[i] - data['close'].iloc[i - 1]) / data['close'].iloc[i - 1]

        # Track peak balance to compute drawdown
        if current_balance > peak_balance:
            peak_balance = current_balance

        drawdown = (peak_balance - current_balance) / peak_balance
        max_drawdown = max(max_drawdown, drawdown)

    return {
        'final_balance': current_balance,
        'trades': trades,
        'profit': current_balance - initial_balance,
        'max_drawdown': max_drawdown * 100
    }
