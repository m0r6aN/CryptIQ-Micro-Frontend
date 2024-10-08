# File path: CryptIQ-Micro-Frontend/services/ai_assistant/market_sentiment_divergence_tracker.py

import pandas as pd

"""
Market Sentiment Divergence Tracker
"""

class MarketSentimentDivergenceTracker:
    def __init__(self, divergence_threshold: float = 0.1):
        self.divergence_threshold = divergence_threshold

    def track_divergence(self, sentiment_data: pd.DataFrame, price_data: pd.DataFrame):
        """
        Track divergence between market sentiment and price data.
        Args:
            sentiment_data: DataFrame containing sentiment scores.
            price_data: DataFrame containing market price data.
        """
        sentiment_data['price_change'] = price_data['close'].pct_change()
        sentiment_data['divergence'] = (sentiment_data['sentiment_score'] - sentiment_data['price_change']).abs()
        divergences = sentiment_data[sentiment_data['divergence'] > self.divergence_threshold]
        return divergences

# Example usage
sentiment_data = pd.DataFrame({
    'timestamp': ['2024-10-01', '2024-10-02', '2024-10-03'],
    'sentiment_score': [0.3, 0.4, -0.2]
})
price_data = pd.DataFrame({
    'timestamp': ['2024-10-01', '2024-10-02', '2024-10-03'],
    'close': [100, 105, 95]
})
tracker = MarketSentimentDivergenceTracker(divergence_threshold=0.15)
print("Detected Divergences:", tracker.track_divergence(sentiment_data, price_data))
