# File path: CryptIQ-Micro-Frontend/services/trading-service/sentiment_trading_strategy.py

import pandas as pd

"""
Sentiment-Enhanced Trading Strategy
"""

class SentimentTradingStrategy:
    def __init__(self, sentiment_data: pd.DataFrame):
        self.sentiment_data = sentiment_data

    def combine_signals(self, market_data: pd.DataFrame):
        """
        Combine market data signals with sentiment analysis to generate trading signals.
        """
        combined = pd.merge(market_data, self.sentiment_data, on='timestamp', how='inner')
        combined['signal'] = combined.apply(self.generate_signal, axis=1)
        return combined

    def generate_signal(self, row):
        """
        Generate a trading signal based on sentiment and market indicators.
        """
        if row['sentiment_score'] > 0.5 and row['rsi'] < 30:
            return 'buy'
        elif row['sentiment_score'] < -0.5 and row['rsi'] > 70:
            return 'sell'
        else:
            return 'hold'

# Example usage
market_data = pd.DataFrame({'timestamp': [1, 2, 3], 'rsi': [25, 75, 50]})
sentiment_data = pd.DataFrame({'timestamp': [1, 2, 3], 'sentiment_score': [0.7, -0.6, 0.3]})
strategy = SentimentTradingStrategy(sentiment_data)
print(strategy.combine_signals(market_data))
