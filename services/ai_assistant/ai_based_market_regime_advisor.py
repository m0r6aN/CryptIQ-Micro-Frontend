from transformers import pipeline

class AIBasedMarketRegimeAdvisor:
    def __init__(self):
        self.market_regime_advisor = pipeline("text-generation", model="EleutherAI/gpt-neo-2.7B")

    def advise_market_regime(self, market_description: str):
        market_advice = self.market_regime_advisor(market_description, max_length=50, num_return_sequences=1)
        return market_advice[0]['generated_text']

advisor = AIBasedMarketRegimeAdvisor()
description = "The market is currently showing mixed signals, with alternating high and low trading volumes."
print(f"Market Regime Advice: {advisor.advise_market_regime(description)}")
