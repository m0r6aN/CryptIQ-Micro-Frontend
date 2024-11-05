# File path: CryptIQ-Micro-Frontend/services/trading-service/sentiment_strategy_selector.py

from sentiment_alert import monitor_and_alert

"""
Sentiment-Driven Strategy Selector
"""

class SentimentStrategySelector:
    def __init__(self, strategies: dict):
        self.strategies = strategies
        self.current_strategy = None

    def select_strategy(self, sentiment_summary: dict):
        """
        Select a strategy based on sentiment analysis.
        """
        if sentiment_summary['positive'] > sentiment_summary['negative'] * 2:
            self.current_strategy = self.strategies.get("bullish")
        elif sentiment_summary['negative'] > sentiment_summary['positive'] * 2:
            self.current_strategy = self.strategies.get("bearish")
        else:
            self.current_strategy = self.strategies.get("neutral")

        return self.current_strategy

    def execute_current_strategy(self, data):
        """
        Execute the currently selected strategy.
        """
        if self.current_strategy:
            return self.current_strategy(data)
        else:
            print("No strategy selected.")

# Example usage
def bullish_strategy(data):
    return "Executing Bullish Strategy"

def bearish_strategy(data):
    return "Executing Bearish Strategy"

strategies = {"bullish": bullish_strategy, "bearish": bearish_strategy, "neutral": lambda x: "Neutral Strategy"}
selector = SentimentStrategySelector(strategies)
sentiment = {"positive": 30, "negative": 10, "neutral": 60}
strategy = selector.select_strategy(sentiment)
print(strategy)
