# File path: CryptIQ-Micro-Frontend/services/ai_assistant/market_sentiment_forecaster.py

from transformers import pipeline

"""
AI-Based Market Sentiment Forecaste
"""

class MarketSentimentForecaster:
    def __init__(self):
        self.forecast_model = pipeline("text-generation", model="gpt-neo-1.3B")

    def forecast_sentiment(self, sentiment_summary: str):
        """
        Forecast future market sentiment based on a summary of current sentiment.
        Args:
            sentiment_summary: Text summary of the current sentiment.
        """
        forecast = self.forecast_model(sentiment_summary, max_length=50, num_return_sequences=1)
        return forecast[0]['generated_text']

# Example usage
forecaster = MarketSentimentForecaster()
sentiment_summary = "Bitcoin sentiment is bullish due to increased institutional interest and positive regulatory news."
print("Sentiment Forecast:", forecaster.forecast_sentiment(sentiment_summary))
