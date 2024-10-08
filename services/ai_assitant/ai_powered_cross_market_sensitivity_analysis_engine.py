# File path: CryptIQ-Micro-Frontend/services/ai_assistant/ai_powered_cross_market_sensitivity_analysis_engine.py

from transformers import pipeline

"""
 AI-Powered Cross-Market Sensitivity Analysis Engine
"""

class AICrossMarketSensitivityAnalysisEngine:
    def __init__(self):
        self.sensitivity_analyzer = pipeline("text-generation", model="EleutherAI/gpt-neo-2.7B")

    def analyze_sensitivity(self, sensitivity_description: str):
        """
        Analyze cross-market sensitivity dynamically based on a description of market conditions.
        Args:
            sensitivity_description: Text description of the market's sensitivity.
        """
        sensitivity_analysis = self.sensitivity_analyzer(sensitivity_description, max_length=50, num_return_sequences=1)
        return sensitivity_analysis[0]['generated_text']

# Example usage
analyzer = AICrossMarketSensitivityAnalysisEngine()
description = "The market is currently highly sensitive to changes in interest rates and macroeconomic events."
print(f"Cross-Market Sensitivity Analysis: {analyzer.analyze_sensitivity(description)}")
