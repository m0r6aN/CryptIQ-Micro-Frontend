# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/real_time_sentiment.py

import time
from transformers import pipeline

# Load pre-trained sentiment model
sentiment_analyzer = pipeline("sentiment-analysis", model="vaishali/CryptoBERT")

def monitor_sentiment(streaming_data_source):
    """
    Monitors sentiment in real-time using a streaming data source.
    Args:
        streaming_data_source: Function or API to stream data in real-time.
    """
    while True:
        message = streaming_data_source.get_next_message()
        sentiment = sentiment_analyzer(message)
        print(f"Sentiment Analysis: {message} -> {sentiment[0]['label']} ({sentiment[0]['score']})")
        time.sleep(1)  # Add a delay for demonstration purposes
