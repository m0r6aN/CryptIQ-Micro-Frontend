from transformers import pipeline

class AIBasedInstitutionalInvestorSentimentAnalyzer:
    def __init__(self):
        self.sentiment_analyzer = pipeline("text-generation", model="EleutherAI/gpt-neo-2.7B")

    def analyze_institutional_sentiment(self, sentiment_description: str):
        institutional_sentiment = self.sentiment_analyzer(sentiment_description, max_length=50, num_return_sequences=1)
        return institutional_sentiment[0]['generated_text']

analyzer = AIBasedInstitutionalInvestorSentimentAnalyzer()
description = "Analyze the sentiment of institutional investors based on recent large buy orders in BTC."
print(f"Institutional Investor Sentiment Analysis: {analyzer.analyze_institutional_sentiment(description)}")
