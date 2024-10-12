# File path: CryptIQ-Micro-Frontend/services/ai_assistant/market_sentiment_scoring_engine.py

from transformers import pipeline

"""
Market Sentiment Scoring Engine
"""

class MarketSentimentScoringEngine:
    def __init__(self):
        self.sentiment_analyzer = pipeline("sentiment-analysis")

    def score_sentiment(self, text_data: list):
        """
        Score sentiment for multiple text inputs and calculate an aggregate score.
        Args:
            text_data: List of text strings to analyze.
        """
        scores = [self.sentiment_analyzer(text)[0]['score'] for text in text_data]
        avg_score = sum(scores) / len(scores) if scores else 0
        return avg_score

# Example usage
engine = MarketSentimentScoringEngine()
text_data = [
    "Bitcoin is showing strong bullish momentum.",
    "ETH price is expected to drop soon due to high gas fees.",
    "LTC is overbought and might see a correction."
]
print(f"Aggregate Sentiment Score: {engine.score_sentiment(text_data)}")
