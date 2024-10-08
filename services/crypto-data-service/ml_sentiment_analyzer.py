# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/ml_sentiment_analyzer.py

from transformers import pipeline
import pandas as pd

"""
Machine Learning-Based Sentiment Analyzer
"""

class MLSentimentAnalyzer:
    def __init__(self):
        self.sentiment_model = pipeline("sentiment-analysis", model="distilbert-base-uncased")

    def analyze_sentiment(self, text: str):
        """
        Analyze the sentiment of a given text.
        """
        result = self.sentiment_model(text)
        return result[0]['label'], result[0]['score']

    def bulk_analyze(self, texts: pd.Series):
        """
        Analyze sentiment in bulk for a series of texts.
        """
        return texts.apply(lambda text: self.analyze_sentiment(text))

# Example usage
analyzer = MLSentimentAnalyzer()
print(analyzer.analyze_sentiment("Bitcoin is surging to new highs!"))
