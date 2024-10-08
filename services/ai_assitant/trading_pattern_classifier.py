# File path: CryptIQ-Micro-Frontend/services/ai_assistant/trading_pattern_classifier.py

from transformers import pipeline

"""
AI-Based Trading Pattern Classifier
"""

class TradingPatternClassifier:
    def __init__(self):
        self.pattern_model = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

    def classify_pattern(self, pattern_description: str, patterns: list):
        """
        Classify trading patterns based on a textual description.
        Args:
            pattern_description: Textual description of the trading pattern.
            patterns: List of pattern classes to classify.
        """
        result = self.pattern_model(pattern_description, patterns)
        return result

# Example usage
classifier = TradingPatternClassifier()
pattern_description = "The price forms a head and shoulders pattern with a sharp drop."
patterns = ["head and shoulders", "double top", "ascending triangle"]
print("Pattern Classification:", classifier.classify_pattern(pattern_description, patterns))
