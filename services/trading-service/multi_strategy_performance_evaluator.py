# File path: CryptIQ-Micro-Frontend/services/trading-service/multi_strategy_performance_evaluator.py

import pandas as pd

"""
Multi-Strategy Performance Evaluator
"""

class MultiStrategyPerformanceEvaluator:
    def __init__(self):
        self.performance_metrics = pd.DataFrame(columns=['strategy', 'total_return', 'max_drawdown'])

    def add_strategy_performance(self, strategy: str, total_return: float, max_drawdown: float):
        """
        Add performance metrics for a given strategy.
        """
        new_metric = pd.DataFrame([[strategy, total_return, max_drawdown]], columns=self.performance_metrics.columns)
        self.performance_metrics = pd.concat([self.performance_metrics, new_metric], ignore_index=True)

    def evaluate_performance(self):
        """
        Evaluate and rank strategies based on performance metrics.
        """
        return self.performance_metrics.sort_values(by='total_return', ascending=False)

# Example usage
evaluator = MultiStrategyPerformanceEvaluator()
evaluator.add_strategy_performance('RSI Strategy', 15.2, -3.4)
evaluator.add_strategy_performance('MACD Strategy', 12.5, -4.1)
evaluator.add_strategy_performance('Bollinger Bands', 18.7, -2.9)
print(evaluator.evaluate_performance())
