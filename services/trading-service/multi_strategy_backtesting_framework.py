# File path: CryptIQ-Micro-Frontend/services/trading-service/multi_strategy_backtesting_framework.py

import pandas as pd

"""
Multi-Strategy Backtesting Framework
"""

class MultiStrategyBacktestingFramework:
    def __init__(self):
        self.strategies = {}

    def register_strategy(self, strategy_name: str, strategy_function):
        """
        Register a new trading strategy in the backtesting framework.
        Args:
            strategy_name: Name of the trading strategy.
            strategy_function: Function that implements the trading strategy.
        """
        self.strategies[strategy_name] = strategy_function

    def backtest(self, price_data: pd.DataFrame, initial_capital: float = 10000):
        """
        Backtest all registered strategies on historical price data.
        Args:
            price_data: DataFrame containing historical price data.
            initial_capital: Initial capital for backtesting.
        """
        results = {}
        for strategy_name, strategy_function in self.strategies.items():
            results[strategy_name] = strategy_function(price_data, initial_capital)
        return results

# Example usage
def dummy_strategy(data, capital):
    return f"Dummy strategy result with {capital}"

backtester = MultiStrategyBacktestingFramework()
backtester.register_strategy('Dummy Strategy', dummy_strategy)

price_data = pd.DataFrame({'price': [100, 105, 110, 115, 120]})
print("Backtesting Results:", backtester.backtest(price_data))
