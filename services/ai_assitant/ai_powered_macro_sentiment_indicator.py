# File path: CryptIQ-Micro-Frontend/services/ai_assistant/ai_powered_macro_sentiment_indicator.py

from transformers import pipeline

"""
AI-Powered Macro Sentiment Indicator
"""

class AIMacroSentimentIndicator:
    def __init__(self):
        self.sentiment_indicator = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

    def generate_macro_indicator(self, macro_description: str, sentiment_labels: list):
        """
        Generate a macro sentiment indicator based on textual descriptions of the market.
        Args:
            macro_description: Text description of the macroeconomic environment.
            sentiment_labels: List of sentiment labels to classify into.
        """
        result = self.sentiment_indicator(macro_description, sentiment_labels)
        return result

# Example usage
indicator = AIMacroSentimentIndicator()
description = "The global economy is facing challenges with rising inflation, geopolitical tensions, and slowing growth."
labels = ["Bullish", "Bearish", "Neutral", "Mixed"]
print("Macro Sentiment Indicator:", indicator.generate_macro_indicator(description, labels))
