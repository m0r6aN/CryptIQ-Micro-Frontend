# File path: CryptIQ-Micro-Frontend/services/ai_assistant/multi_layer_social_sentiment_network_visualizer.py

import pandas as pd
import networkx as nx
import matplotlib.pyplot as plt

"""
Multi-Layer Social Sentiment Network Visualizer
"""

class MultiLayerSocialSentimentNetworkVisualizer:
    def __init__(self):
        self.network = nx.MultiDiGraph()

    def build_network(self, sentiment_data: pd.DataFrame):
        """
        Build a multi-layer social sentiment network.
        Args:
            sentiment_data: DataFrame containing social sentiment data.
        """
        for index, row in sentiment_data.iterrows():
            self.network.add_edge(row['source'], row['target'], weight=row['sentiment_score'])

    def visualize_network(self):
        """
        Visualize the multi-layer sentiment network.
        """
        pos = nx.spring_layout(self.network)
        plt.figure(figsize=(14, 10))
        nx.draw(self.network, pos, with_labels=True, node_size=7000, node_color="orange", font_size=15, font_weight="bold")
        plt.title("Multi-Layer Social Sentiment Network")
        plt.show()

# Example usage
sentiment_data = pd.DataFrame({
    'source': ['UserA', 'UserB', 'UserC', 'UserD'],
    'target': ['UserB', 'UserC', 'UserD', 'UserA'],
    'sentiment_score': [0.3, 0.4, -0.2, 0.5]
})
visualizer = MultiLayerSocialSentimentNetworkVisualizer()
visualizer.build_network(sentiment_data)
visualizer.visualize_network()
