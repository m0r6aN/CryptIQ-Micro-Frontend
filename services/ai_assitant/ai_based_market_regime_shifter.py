# File path: CryptIQ-Micro-Frontend/services/ai_assistant/ai_based_market_regime_shifter.py

from transformers import pipeline

"""
AI-Based Market Regime Shifter
"""

class AIMarketRegimeShifter:
    def __init__(self):
        self.regime_shifter = pipeline("text-classification", model="facebook/bart-large-mnli")

    def shift_market_regime(self, market_description: str, regimes: list):
        """
        Shift market regimes based on a description of market conditions.
        Args:
            market_description: Text description of the current market.
            regimes: List of possible market regimes to classify.
        """
        result = self.regime_shifter(market_description, regimes)
        return result

# Example usage
shifter = AIMarketRegimeShifter()
description = "The market is transitioning from a bullish regime to a neutral regime due to mixed economic indicators."
regimes = ["Bullish", "Bearish", "Neutral", "Volatile"]
print("Market Regime Shift:", shifter.shift_market_regime(description, regimes))
