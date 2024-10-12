# File path: CryptIQ-Micro-Frontend/services/ai_assistant/multi_layer_market_sentiment_network_analysis.py

import pandas as pd
import networkx as nx
import matplotlib.pyplot as plt

"""
Multi-Layer Market Sentiment Network Analysis Engine
"""

class MultiLayerMarketSentimentNetwork:
    def __init__(self):
        self.network = nx.MultiDiGraph()

    def build_network(self, sentiment_data: pd.DataFrame):
        """
        Build a multi-layer market sentiment network from sentiment data.
        Args:
            sentiment_data: DataFrame containing sentiment data between markets.
        """
        for index, row in sentiment_data.iterrows():
            self.network.add_edge(row['source_market'], row['target_market'], weight=row['sentiment_score'])

    def visualize_network(self):
        """
        Visualize the multi-layer sentiment network.
        """
        pos = nx.spring_layout(self.network)
        plt.figure(figsize=(12, 8))
        nx.draw(self.network, pos, with_labels=True, node_size=7000, node_color="skyblue", font_size=15, font_weight="bold")
        plt.title("Multi-Layer Market Sentiment Network")
        plt.show()

# Example usage
sentiment_data = pd.DataFrame({
    'source_market': ['BTC', 'ETH', 'BTC', 'LTC'],
    'target_market': ['ETH', 'LTC', 'LTC', 'BTC'],
    'sentiment_score': [0.3, 0.4, -0.2, 0.5]
})
network = MultiLayerMarketSentimentNetwork()
network.build_network(sentiment_data)
network.visualize_network()
