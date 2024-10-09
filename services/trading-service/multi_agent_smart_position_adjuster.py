from transformers import pipeline

class AISmartMarketPositionAdjuster:
    def __init__(self):
        self.position_adjuster = pipeline("text-generation", model="EleutherAI/gpt-neo-2.7B")

    def adjust_position(self, position_description: str):
        position_adjustment = self.position_adjuster(position_description, max_length=50, num_return_sequences=1)
        return position_adjustment[0]['generated_text']

adjuster = AISmartMarketPositionAdjuster()
description = "The market is currently showing strong resistance, indicating positions should be adjusted to reduce risk exposure."
print(f"Market Position Adjustment Recommendation: {adjuster.adjust_position(description)}")
