# File path: CryptIQ-Micro-Frontend/services/trading-service/strategy_performance_tracker.py

import pandas as pd

class StrategyPerformanceTracker:
    def __init__(self):
        self.performance_data = []

    def log_performance(self, strategy_name: str, initial_balance: float, final_balance: float, trades: int):
        """
        Logs the performance metrics for a given strategy.
        Args:
            strategy_name: Name of the strategy.
            initial_balance: Starting balance.
            final_balance: Ending balance after execution.
            trades: Total trades executed.
        """
        performance = {
            "strategy_name": strategy_name,
            "initial_balance": initial_balance,
            "final_balance": final_balance,
            "total_profit": final_balance - initial_balance,
            "total_trades": trades
        }
        self.performance_data.append(performance)

    def get_performance_summary(self):
        """
        Returns a summary of all tracked strategies.
        """
        return pd.DataFrame(self.performance_data)

# Example usage
tracker = StrategyPerformanceTracker()
tracker.log_performance("rsi_strategy", 10000, 12000, 15)
print(tracker.get_performance_summary())
