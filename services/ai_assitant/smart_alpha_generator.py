# File path: CryptIQ-Micro-Frontend/services/ai_assistant/smart_alpha_generator.py

from transformers import pipeline

"""
Smart Alpha Generator for Crypto Assets
"""

class SmartAlphaGenerator:
    def __init__(self):
        self.alpha_model = pipeline("text-generation", model="gpt-neo-2.7B")

    def generate_alpha(self, asset_summary: str):
        """
        Generate alpha signals based on asset summary and recent performance.
        Args:
            asset_summary: Text summary of the asset's recent performance and fundamentals.
        """
        alpha_signal = self.alpha_model(asset_summary, max_length=50, num_return_sequences=1)
        return alpha_signal[0]['generated_text']

# Example usage
generator = SmartAlphaGenerator()
asset_summary = "Bitcoin is experiencing high volatility, with strong support at $45,000 and positive market sentiment."
print(f"Alpha Signal: {generator.generate_alpha(asset_summary)}")
