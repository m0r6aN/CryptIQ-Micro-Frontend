# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/news_sentiment.py

import requests
from transformers import pipeline

"""
 News Sentiment Analysis Service
"""

# Load sentiment model
news_sentiment_model = pipeline("sentiment-analysis", model="distilbert-base-uncased")

NEWS_API_URL = "https://newsapi.org/v2/everything"
NEWS_API_KEY = "your_news_api_key"

def fetch_latest_news(keyword: str):
    """
    Fetch the latest news articles for the specified keyword.
    """
    params = {'q': keyword, 'apiKey': NEWS_API_KEY, 'sortBy': 'publishedAt'}
    response = requests.get(NEWS_API_URL, params=params)
    return response.json().get("articles", [])

def analyze_news_sentiment(keyword: str):
    """
    Analyze sentiment for the latest news articles on a specific keyword.
    """
    articles = fetch_latest_news(keyword)
    sentiment_scores = [news_sentiment_model(article['description'])[0] for article in articles if article['description']]

    sentiment_summary = {
        "positive": len([s for s in sentiment_scores if s['label'] == 'POSITIVE']),
        "negative": len([s for s in sentiment_scores if s['label'] == 'NEGATIVE']),
        "neutral": len([s for s in sentiment_scores if s['label'] == 'NEUTRAL']),
    }

    return sentiment_summary
