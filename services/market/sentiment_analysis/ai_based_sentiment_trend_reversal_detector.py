# File path: CryptIQ-Micro-Frontend/services/ai_assistant/ai_based_sentiment_trend_reversal_detector.py

from transformers import pipeline

"""
AI-Based Sentiment Trend Reversal Detector
"""

class AISentimentTrendReversalDetector:
    def __init__(self):
        self.reversal_detector = pipeline("text-classification", model="facebook/bart-large-mnli")

    def detect_trend_reversal(self, sentiment_description: str, trend_labels: list):
        """
        Detect sentiment trend reversals based on textual descriptions.
        Args:
            sentiment_description: Text description of current sentiment.
            trend_labels: List of trend labels to classify into.
        """
        result = self.reversal_detector(sentiment_description, trend_labels)
        return result

# Example usage
detector = AISentimentTrendReversalDetector()
description = "The market sentiment is shifting from extreme optimism to caution due to increased uncertainty."
labels = ["Bullish Reversal", "Bearish Reversal", "Neutral"]
print("Sentiment Trend Reversal Detection:", detector.detect_trend_reversal(description, labels))
