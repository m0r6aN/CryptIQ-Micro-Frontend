# File path: CryptIQ-Micro-Frontend/services/ai_assistant/ai_based_multi_market_regime_detection_engine.py

from transformers import pipeline

"""
AI-Based Multi-Market Regime Detection Engine
"""

class AIMultiMarketRegimeDetectionEngine:
    def __init__(self):
        self.regime_detector = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

    def detect_regime(self, market_description: str, regime_states: list):
        """
        Detect market regimes based on textual descriptions of multiple market conditions.
        Args:
            market_description: Text description of market conditions.
            regime_states: List of potential market regimes.
        """
        regime_result = self.regime_detector(market_description, regime_states)
        return regime_result

# Example usage
detector = AIMultiMarketRegimeDetectionEngine()
description = "The crypto market is showing signs of transitioning from a bullish to a mixed regime, with increasing uncertainty."
states = ["Bullish", "Bearish", "Mixed", "Neutral"]
print("Market Regime Detection Results:", detector.detect_regime(description, states))
