# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/social_sentiment_aggregator.py

import requests
import pandas as pd

"""
Social Media Sentiment Aggregator
"""

class SocialSentimentAggregator:
    def __init__(self, api_urls: dict):
        self.api_urls = api_urls

    def fetch_social_data(self, platform: str, keyword: str):
        """
        Fetch sentiment data from a specified social media platform.
        Args:
            platform: Social media platform name (e.g., 'twitter', 'reddit').
            keyword: Keyword to search for sentiment analysis.
        """
        url = self.api_urls.get(platform)
        if not url:
            print(f"API URL not found for platform: {platform}")
            return pd.DataFrame()

        params = {'q': keyword}
        response = requests.get(url, params=params)
        if response.status_code == 200:
            return pd.DataFrame(response.json()['data'])
        else:
            print(f"Error fetching data from {platform}")
            return pd.DataFrame()

    def aggregate_sentiment(self, keyword: str):
        """
        Aggregate sentiment data from all configured platforms.
        """
        all_sentiment = []
        for platform in self.api_urls:
            platform_data = self.fetch_social_data(platform, keyword)
            if not platform_data.empty:
                all_sentiment.append(platform_data)

        return pd.concat(all_sentiment, ignore_index=True) if all_sentiment else pd.DataFrame()

# Example usage
api_urls = {
    'twitter': 'https://api.twitter.com/2/tweets/search/recent',
    'reddit': 'https://www.reddit.com/search.json'
}
aggregator = SocialSentimentAggregator(api_urls)
print(aggregator.aggregate_sentiment('Bitcoin'))
