# File path: CryptIQ-Micro-Frontend/services/ai_assistant/ai_powered_market_regime_mapping_engine.py

from transformers import pipeline

"""
 AI-Powered Market Regime Mapping Engine
"""

class AIMarketRegimeMappingEngine:
    def __init__(self):
        self.regime_mapper = pipeline("text-generation", model="EleutherAI/gpt-neo-2.7B")

    def map_regime(self, market_description: str):
        """
        Map current market regime based on textual descriptions of the market.
        Args:
            market_description: Text description of the market environment.
        """
        mapped_regime = self.regime_mapper(market_description, max_length=50, num_return_sequences=1)
        return mapped_regime[0]['generated_text']

# Example usage
mapper = AIMarketRegimeMappingEngine()
description = "The market is showing signs of a transition from a bullish to a bearish regime, with increasing selling pressure."
print(f"Mapped Market Regime: {mapper.map_regime(description)}")
