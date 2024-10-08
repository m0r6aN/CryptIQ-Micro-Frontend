# File path: CryptIQ-Micro-Frontend/services/ai_assistant/ai_based_whale_activity_analyzer.py

from transformers import pipeline

"""
AI-Based Whale Activity Analyzer
"""

class AIWhaleActivityAnalyzer:
    def __init__(self):
        self.activity_analyzer = pipeline("text-classification", model="distilbert-base-uncased")

    def analyze_whale_activity(self, activity_description: str):
        """
        Analyze whale activity based on textual descriptions.
        Args:
            activity_description: Text describing the observed whale activity.
        """
        result = self.activity_analyzer(activity_description)
        return result[0]['label'], result[0]['score']

# Example usage
analyzer = AIWhaleActivityAnalyzer()
activity_description = "A large whale has just moved 500 BTC from a cold wallet to Binance, indicating a potential sell-off."
print(f"Whale Activity Analysis: {analyzer.analyze_whale_activity(activity_description)}")
