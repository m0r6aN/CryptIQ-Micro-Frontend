# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/sentiment_analysis.py

from transformers import pipeline

# Load a pre-trained sentiment analysis model (e.g., CryptoBERT)
sentiment_model = pipeline("sentiment-analysis", model="vaishali/CryptoBERT")

def analyze_sentiment(text: str):
    """
    Analyzes the sentiment of the given text.
    Returns a score between -1 (negative) and 1 (positive).
    """
    result = sentiment_model(text)
    return result[0]["label"], result[0]["score"]
