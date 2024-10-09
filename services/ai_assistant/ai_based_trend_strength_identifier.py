from transformers import pipeline

class AIBasedTrendStrengthIdentifier:
    def __init__(self):
        self.trend_strength_identifier = pipeline("text-generation", model="EleutherAI/gpt-neo-2.7B")

    def identify_trend_strength(self, trend_description: str):
        trend_strength = self.trend_strength_identifier(trend_description, max_length=50, num_return_sequences=1)
        return trend_strength[0]['generated_text']

identifier = AIBasedTrendStrengthIdentifier()
description = "The market is currently seeing a steady increase in BTC prices, with strong buy-side volume."
print(f"Trend Strength Identified: {identifier.identify_trend_strength(description)}")
