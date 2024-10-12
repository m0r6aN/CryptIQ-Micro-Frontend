# File path: CryptIQ-Micro-Frontend/services/ai_assistant/ai_driven_smart_strategy_selector.py

from transformers import pipeline

"""
AI-Driven Smart Strategy Selector
"""

class AISmartStrategySelector:
    def __init__(self):
        self.strategy_selector = pipeline("text-classification", model="facebook/bart-large-mnli")

    def select_strategy(self, market_description: str, strategies: list):
        """
        Select the optimal trading strategy based on current market conditions.
        Args:
            market_description: Text description of the current market.
            strategies: List of available strategies to choose from.
        """
        result = self.strategy_selector(market_description, strategies)
        return result

# Example usage
selector = AISmartStrategySelector()
description = "The market is showing signs of a breakout with increased volume and strong momentum."
strategies = ["Momentum Strategy", "Breakout Strategy", "Mean Reversion", "Scalping"]
print("Optimal Strategy:", selector.select_strategy(description, strategies))
