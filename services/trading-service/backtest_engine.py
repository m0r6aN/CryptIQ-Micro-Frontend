# File path: CryptIQ-Micro-Frontend/services/trading-service/backtest_engine.py

import pandas as pd

"""
Trade Execution Backtest Engine
"""

def backtest_trade_execution(strategy_function, data: pd.DataFrame, initial_balance: float = 10000):
    """
    Runs a trade execution backtest with a specified strategy.
    Args:
        strategy_function: Trading strategy function.
        data: Historical OHLCV data.
        initial_balance: Starting balance for the backtest.
    """
    balance = initial_balance
    position = 0
    for i in range(1, len(data)):
        signal = strategy_function(data.iloc[:i])
        
        if signal == 'buy' and balance > data['close'].iloc[i]:  # Buy signal
            position = balance / data['close'].iloc[i]
            balance = 0
        elif signal == 'sell' and position > 0:  # Sell signal
            balance = position * data['close'].iloc[i]
            position = 0

    return {
        "final_balance": balance,
        "total_profit": balance - initial_balance,
        "total_trades": len([s for s in strategy_function(data) if s in ['buy', 'sell']])
    }
