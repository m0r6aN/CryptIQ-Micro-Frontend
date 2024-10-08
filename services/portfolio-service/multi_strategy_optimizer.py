# File path: CryptIQ-Micro-Frontend/services/portfolio-service/multi_strategy_optimizer.py

import pandas as pd

"""
Multi-Strategy Portfolio Allocation Optimizer
"""

class MultiStrategyOptimizer:
    def __init__(self, strategies: dict, initial_balance: float):
        self.strategies = strategies
        self.initial_balance = initial_balance

    def allocate_portfolio(self, data: pd.DataFrame):
        """
        Allocates the portfolio across multiple strategies based on their performance.
        """
        performance_scores = {name: strategy(data) for name, strategy in self.strategies.items()}
        total_score = sum(performance_scores.values())
        
        # Allocate based on performance score percentage
        allocations = {name: (score / total_score) * self.initial_balance for name, score in performance_scores.items()}
        return allocations

# Example strategies
def rsi_performance(data):
    return data['close'].pct_change().sum()  # Placeholder performance metric

def macd_performance(data):
    return data['close'].rolling(10).mean().iloc[-1]  # Placeholder performance metric

strategies = {"RSI": rsi_performance, "MACD": macd_performance}
optimizer = MultiStrategyOptimizer(strategies, 10000)

data = pd.DataFrame({'close': [100, 102, 105, 103, 107]})
print(optimizer.allocate_portfolio(data))
