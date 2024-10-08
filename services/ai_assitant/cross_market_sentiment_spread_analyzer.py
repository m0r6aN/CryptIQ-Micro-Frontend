# File path: CryptIQ-Micro-Frontend/services/ai_assistant/cross_market_sentiment_spread_analyzer.py

import pandas as pd

"""
Cross-Market Sentiment Spread Analyzer
"""

class CrossMarketSentimentSpreadAnalyzer:
    def __init__(self):
        pass

    def analyze_sentiment_spread(self, sentiment_data: pd.DataFrame):
        """
        Analyze sentiment spread across multiple markets.
        Args:
            sentiment_data: DataFrame containing sentiment scores for different markets.
        """
        sentiment_data['sentiment_spread'] = sentiment_data.max(axis=1) - sentiment_data.min(axis=1)
        return sentiment_data

# Example usage
sentiment_data = pd.DataFrame({
    'BTC_sentiment': [0.5, 0.6, 0.7, 0.8],
    'ETH_sentiment': [0.4, 0.5, 0.65, 0.7],
    'LTC_sentiment': [0.3, 0.45, 0.55, 0.6]
})
analyzer = CrossMarketSentimentSpreadAnalyzer()
print("Sentiment Spread Analysis:", analyzer.analyze_sentiment_spread(sentiment_data))
