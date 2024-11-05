# File path: CryptIQ-Micro-Frontend/services/ai_assistant/market_condition_predictor.py

from transformers import pipeline

"""
AI-Based Market Condition Predictor
"""

class MarketConditionPredictor:
    def __init__(self):
        self.predictor_model = pipeline("text-classification")

    def predict_market_condition(self, market_description: str):
        """
        Predict market conditions based on a textual description of the market.
        Args:
            market_description: Text describing the current market.
        """
        prediction = self.predictor_model(market_description)
        return prediction[0]['label'], prediction[0]['score']

# Example usage
predictor = MarketConditionPredictor()
market_description = "The market is showing increased volatility with strong bullish momentum in tech stocks."
print(f"Market Condition: {predictor.predict_market_condition(market_description)}")
