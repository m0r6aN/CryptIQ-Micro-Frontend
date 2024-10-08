# File path: CryptIQ-Micro-Frontend/services/portfolio-service/dynamic_portfolio_allocation_engine.py

import pandas as pd

"""
Dynamic Portfolio Allocation Engine
"""

class DynamicPortfolioAllocationEngine:
    def __init__(self, initial_allocations: dict, risk_tolerance: float = 0.5):
        self.initial_allocations = initial_allocations
        self.risk_tolerance = risk_tolerance

    def adjust_allocations(self, market_conditions: str):
        """
        Dynamically adjust portfolio allocations based on current market conditions and risk tolerance.
        Args:
            market_conditions: Text description of current market conditions.
        """
        adjusted_allocations = self.initial_allocations.copy()
        if "bullish" in market_conditions:
            adjusted_allocations = {k: v * (1 + self.risk_tolerance) for k, v in adjusted_allocations.items()}
        elif "bearish" in market_conditions:
            adjusted_allocations = {k: v * (1 - self.risk_tolerance) for k, v in adjusted_allocations.items()}

        # Normalize allocations
        total = sum(adjusted_allocations.values())
        normalized_allocations = {k: v / total for k, v in adjusted_allocations.items()}

        return normalized_allocations

# Example usage
initial_allocations = {'BTC': 0.4, 'ETH': 0.3, 'USDT': 0.3}
engine = DynamicPortfolioAllocationEngine(initial_allocations, risk_tolerance=0.2)
print(engine.adjust_allocations("The market is looking bullish"))
