# File path: CryptIQ-Micro-Frontend/services/portfolio-service/multi_strategy_dynamic_hedging_engine.py

import pandas as pd

"""
Multi-Strategy Dynamic Hedging Engine
"""

class MultiStrategyDynamicHedgingEngine:
    def __init__(self):
        self.strategies = {}

    def register_strategy(self, strategy_name: str, hedging_function):
        """
        Register a new dynamic hedging strategy.
        Args:
            strategy_name: Name of the hedging strategy.
            hedging_function: Function implementing the strategy.
        """
        self.strategies[strategy_name] = hedging_function

    def apply_hedging(self, portfolio: pd.DataFrame):
        """
        Apply hedging strategies using registered methods.
        Args:
            portfolio: DataFrame containing portfolio data.
        """
        hedging_results = {}
        for strategy_name, hedging_function in self.strategies.items():
            hedging_results[strategy_name] = hedging_function(portfolio)
        return hedging_results

# Example usage
def dummy_hedging_strategy_1(data):
    return f"Hedging Strategy 1 applied on {data.shape[0]} rows"

def dummy_hedging_strategy_2(data):
    return f"Hedging Strategy 2 adjusted values in columns: {data.columns}"

engine = MultiStrategyDynamicHedgingEngine()
engine.register_strategy('Hedging Strategy 1', dummy_hedging_strategy_1)
engine.register_strategy('Hedging Strategy 2', dummy_hedging_strategy_2)

portfolio = pd.DataFrame({'asset': ['BTC', 'ETH', 'LTC'], 'value': [10000, 5000, 2000]})
print("Hedging Results:", engine.apply_hedging(portfolio))
