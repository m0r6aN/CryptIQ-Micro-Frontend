from transformers import pipeline

class AIBasedMarketRiskIndicatorEngine:
    def __init__(self):
        self.risk_indicator = pipeline("text-generation", model="EleutherAI/gpt-neo-2.7B")

    def generate_risk_indicator(self, market_description: str):
        risk_indicator = self.risk_indicator(market_description, max_length=50, num_return_sequences=1)
        return risk_indicator[0]['generated_text']

indicator = AIBasedMarketRiskIndicatorEngine()
description = "The market is experiencing rapid price swings and increased leverage activity across multiple assets."
print(f"Market Risk Indicator: {indicator.generate_risk_indicator(description)}")
