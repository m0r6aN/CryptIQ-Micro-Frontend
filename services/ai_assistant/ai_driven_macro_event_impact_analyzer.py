# File path: CryptIQ-Micro-Frontend/services/ai_assistant/ai_driven_macro_event_impact_analyzer.py

from transformers import pipeline

"""
AI-Driven Macro Event Impact Analyzer
"""

class AIMacroEventImpactAnalyzer:
    def __init__(self):
        self.impact_analyzer = pipeline("text-generation", model="EleutherAI/gpt-neo-2.7B")

    def analyze_impact(self, event_description: str):
        """
        Analyze macro event impact based on a description of the event.
        Args:
            event_description: Text description of the macroeconomic event.
        """
        impact_analysis = self.impact_analyzer(event_description, max_length=50, num_return_sequences=1)
        return impact_analysis[0]['generated_text']

# Example usage
analyzer = AIMacroEventImpactAnalyzer()
description = "The Federal Reserve announced a 0.25% interest rate hike, indicating tightening monetary policy."
print(f"Macro Event Impact Analysis: {analyzer.analyze_impact(description)}")
