# File path: CryptIQ-Micro-Frontend/services/ai_assistant/dynamic_market_risk_regime_classifier.py

from transformers import pipeline

"""
Dynamic Market Risk Regime Classifier
"""

class DynamicMarketRiskRegimeClassifier:
    def __init__(self):
        self.risk_classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

    def classify_risk_regime(self, market_description: str, regimes: list):
        """
        Classify the current market into one of the risk regimes.
        Args:
            market_description: Text description of the market.
            regimes: List of risk regimes to classify into.
        """
        result = self.risk_classifier(market_description, regimes)
        return result

# Example usage
classifier = DynamicMarketRiskRegimeClassifier()
description = "The market is experiencing increased volatility and high trading volume, with uncertain economic outlook."
regimes = ["High Risk", "Moderate Risk", "Low Risk", "Extreme Risk"]
print("Risk Regime Classification:", classifier.classify_risk_regime(description, regimes))
