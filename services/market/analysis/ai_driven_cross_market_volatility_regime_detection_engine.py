from transformers import pipeline

class AICrossMarketVolatilityRegimeDetectionEngine:
    def __init__(self):
        self.volatility_detector = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

    def detect_volatility_regime(self, market_description: str, regime_states: list):
        result = self.volatility_detector(market_description, regime_states)
        return result

detector = AICrossMarketVolatilityRegimeDetectionEngine()
description = "The market is experiencing a spike in volatility, indicating a transition to a high-risk regime."
states = ["High Volatility", "Low Volatility", "Medium Volatility", "Stable"]
print("Volatility Regime Detection Results:", detector.detect_volatility_regime(description, states))
