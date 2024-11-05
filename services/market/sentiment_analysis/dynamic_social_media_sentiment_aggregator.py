# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/dynamic_social_media_sentiment_aggregator.py

import pandas as pd
import requests

"""
Dynamic Social Media Sentiment Aggregator
"""

class DynamicSocialMediaSentimentAggregator:
    def __init__(self, api_url: str):
        self.api_url = api_url

    def fetch_social_data(self, asset: str):
        """
        Fetch social media sentiment data for a specific asset.
        Args:
            asset: Name of the crypto asset.
        """
        response = requests.get(f"{self.api_url}/social_sentiment/{asset}")
        if response.status_code == 200:
            return pd.DataFrame(response.json()['sentiment_data'])
        else:
            print("Error fetching social sentiment data")
            return pd.DataFrame()

    def aggregate_sentiment(self, sentiment_data: pd.DataFrame):
        """
        Aggregate sentiment data to generate a cumulative sentiment score.
        """
        sentiment_data['cumulative_score'] = sentiment_data['positive'] - sentiment_data['negative']
        return sentiment_data

# Example usage
aggregator = DynamicSocialMediaSentimentAggregator("https://api.socialsentiment.com")
social_data = aggregator.fetch_social_data("BTC")
print(aggregator.aggregate_sentiment(social_data))
