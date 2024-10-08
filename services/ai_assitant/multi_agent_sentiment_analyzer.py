# File path: CryptIQ-Micro-Frontend/services/ai_assistant/multi_agent_sentiment_analyzer.py

from transformers import pipeline

"""
Multi-Agent Market Sentiment Analyzer
"""

class MultiAgentSentimentAnalyzer:
    def __init__(self):
        self.sentiment_agents = {
            'TwitterSentiment': pipeline("sentiment-analysis"),
            'RedditSentiment': pipeline("sentiment-analysis"),
            'NewsSentiment': pipeline("sentiment-analysis")
        }

    def analyze_sentiment(self, text_data: dict):
        """
        Analyze sentiment using multiple agents and compile the results.
        Args:
            text_data: Dictionary where keys are platform names and values are text to analyze.
        """
        sentiment_results = {}
        for platform, text in text_data.items():
            agent = self.sentiment_agents.get(platform)
            if agent:
                result = agent(text)
                sentiment_results[platform] = result[0]['label']
        return sentiment_results

# Example usage
text_data = {
    'TwitterSentiment': "Bitcoin is soaring! Can't believe the price is up 20% today!",
    'RedditSentiment': "ETH is overvalued. Too many people are bullish, could drop soon.",
    'NewsSentiment': "Bitcoin's rally continues as institutions drive interest."
}
analyzer = MultiAgentSentimentAnalyzer()
print(analyzer.analyze_sentiment(text_data))
