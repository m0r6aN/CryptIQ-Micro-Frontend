# File path: CryptIQ-Micro-Frontend/services/ai_assistant/ai_powered_market_regime_classifier.py

from transformers import pipeline

"""
AI-Powered Market Regime Classifier
"""

class AIPoweredMarketRegimeClassifier:
    def __init__(self):
        self.regime_classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

    def classify_market_regime(self, description: str, regimes: list):
        """
        Classify market regimes based on a textual description.
        Args:
            description: Textual description of the market.
            regimes: List of possible market regimes to classify.
        """
        result = self.regime_classifier(description, regimes)
        return result

# Example usage
classifier = AIPoweredMarketRegimeClassifier()
description = "The market is currently experiencing high volatility with strong bearish momentum."
regimes = ["bullish", "bearish", "neutral", "volatile"]
print("Market Regime Classification:", classifier.classify_market_regime(description, regimes))
