# File path: CryptIQ-Micro-Frontend/services/trading-service/smart_strategy_performance_tracker.py

import pandas as pd

"""
Smart Strategy Performance Tracker
"""

class SmartStrategyPerformanceTracker:
    def __init__(self):
        self.strategy_performance = pd.DataFrame(columns=['strategy', 'profit', 'drawdown'])

    def record_performance(self, strategy: str, profit: float, drawdown: float):
        """
        Record performance metrics for a given strategy.
        Args:
            strategy: Name of the trading strategy.
            profit: Total profit generated.
            drawdown: Maximum drawdown observed.
        """
        new_record = pd.DataFrame([[strategy, profit, drawdown]], columns=self.strategy_performance.columns)
        self.strategy_performance = pd.concat([self.strategy_performance, new_record], ignore_index=True)

    def get_top_strategies(self, top_n: int = 3):
        """
        Get the top N strategies based on profit.
        Args:
            top_n: Number of top strategies to return.
        """
        return self.strategy_performance.sort_values(by='profit', ascending=False).head(top_n)

# Example usage
tracker = SmartStrategyPerformanceTracker()
tracker.record_performance('Momentum Strategy', 15000, -3000)
tracker.record_performance('Scalping Strategy', 12000, -2000)
tracker.record_performance('Mean Reversion', 18000, -2500)
print("Top Strategies:", tracker.get_top_strategies(top_n=2))
