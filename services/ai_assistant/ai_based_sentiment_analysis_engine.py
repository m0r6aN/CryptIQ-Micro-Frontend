from transformers import pipeline

class AIBasedSentimentAnalysisEngine:
    def __init__(self):
        self.sentiment_analyzer = pipeline("sentiment-analysis")

    def analyze_sentiment(self, sentiment_description: str):
        sentiment_result = self.sentiment_analyzer(sentiment_description)
        return sentiment_result[0]

analyzer = AIBasedSentimentAnalysisEngine()
description = "The recent news about regulatory changes has caused uncertainty among crypto investors."
print(f"Sentiment Analysis Result: {analyzer.analyze_sentiment(description)}")
