from transformers import pipeline

class AIBasedNewsAndEventsSentimentAnalyzer:
    def __init__(self):
        self.news_sentiment_analyzer = pipeline("text-generation", model="EleutherAI/gpt-neo-2.7B")

    def analyze_news_sentiment(self, news_description: str):
        sentiment_analysis = self.news_sentiment_analyzer(news_description, max_length=50, num_return_sequences=1)
        return sentiment_analysis[0]['generated_text']

analyzer = AIBasedNewsAndEventsSentimentAnalyzer()
description = "Analyze the market sentiment based on recent news regarding SEC regulations on cryptocurrencies."
print(f"News Sentiment Analysis: {analyzer.analyze_news_sentiment(description)}")
