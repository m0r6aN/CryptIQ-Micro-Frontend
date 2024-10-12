# File path: CryptIQ-Micro-Frontend/services/ai_assistant/ai_powered_sentiment_flow_mapper.py

import pandas as pd
import matplotlib.pyplot as plt
import networkx as nx

"""
AI-Powered Sentiment Flow Mapper
"""

class AISentimentFlowMapper:
    def __init__(self):
        self.network = nx.DiGraph()

    def build_sentiment_flow(self, sentiment_data: pd.DataFrame):
        """
        Build a sentiment flow map between entities.
        Args:
            sentiment_data: DataFrame containing sentiment flows between entities.
        """
        for index, row in sentiment_data.iterrows():
            self.network.add_edge(row['source'], row['target'], weight=row['flow_strength'])

    def visualize_flow(self):
        """
        Visualize the sentiment flow map.
        """
        pos = nx.spring_layout(self.network)
        plt.figure(figsize=(12, 8))
        nx.draw(self.network, pos, with_labels=True, node_size=7000, node_color="lightblue", font_size=15, font_weight="bold", edge_color="gray")
        plt.title("Sentiment Flow Map")
        plt.show()

# Example usage
sentiment_data = pd.DataFrame({
    'source': ['BTC_TraderA', 'ETH_TraderB', 'LTC_TraderC'],
    'target': ['ETH_TraderB', 'LTC_TraderC', 'BTC_TraderA'],
    'flow_strength': [0.7, 0.5, 0.9]
})
flow_mapper = AISentimentFlowMapper()
flow_mapper.build_sentiment_flow(sentiment_data)
flow_mapper.visualize_flow()
