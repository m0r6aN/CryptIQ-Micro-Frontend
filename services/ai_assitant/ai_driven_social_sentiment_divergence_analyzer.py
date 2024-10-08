# File path: CryptIQ-Micro-Frontend/services/ai_assistant/ai_driven_social_sentiment_divergence_analyzer.py

from transformers import pipeline

"""
AI-Driven Social Sentiment Divergence Analyzer
"""

class AISocialSentimentDivergenceAnalyzer:
    def __init__(self):
        self.sentiment_analyzer = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

    def analyze_divergence(self, sentiment_description: str, sentiment_states: list):
        """
        Analyze social sentiment divergence based on textual descriptions.
        Args:
            sentiment_description: Text description of social sentiment.
            sentiment_states: List of sentiment states to classify into.
        """
        result = self.sentiment_analyzer(sentiment_description, sentiment_states)
        return result

# Example usage
analyzer = AISocialSentimentDivergenceAnalyzer()
description = "Social media sentiment is increasingly positive, but on-chain data shows increased selling pressure."
states = ["Bullish", "Bearish", "Neutral", "Mixed Sentiment"]
print("Social Sentiment Divergence:", analyzer.analyze_divergence(description, states))
