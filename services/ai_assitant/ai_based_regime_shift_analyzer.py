# File path: CryptIQ-Micro-Frontend/services/ai_assistant/ai_based_regime_shift_analyzer.py

from transformers import pipeline

"""
 AI-Based Regime Shift Analyzer
"""

class AIRegimeShiftAnalyzer:
    def __init__(self):
        self.regime_analyzer = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

    def analyze_regime_shift(self, regime_description: str, regime_states: list):
        """
        Analyze regime shifts based on textual descriptions of the market.
        Args:
            regime_description: Text description of the market environment.
            regime_states: List of potential regime states.
        """
        result = self.regime_analyzer(regime_description, regime_states)
        return result

# Example usage
analyzer = AIRegimeShiftAnalyzer()
description = "The market is transitioning from a bullish to a mixed regime, with increasing volatility and uncertainty."
states = ["Bullish", "Bearish", "Mixed", "Neutral"]
print("Regime Shift Analysis:", analyzer.analyze_regime_shift(description, states))
