from transformers import pipeline

class AIDrivenMarketFragilityAnalyzer:
    def __init__(self):
        self.market_fragility_analyzer = pipeline("text-generation", model="EleutherAI/gpt-neo-2.7B")

    def analyze_fragility(self, fragility_description: str):
        fragility_analysis = self.market_fragility_analyzer(fragility_description, max_length=50, num_return_sequences=1)
        return fragility_analysis[0]['generated_text']

analyzer = AIDrivenMarketFragilityAnalyzer()
description = "Analyze market fragility for BTC, considering recent order book changes, liquidity, and volatility patterns."
print(f"Market Fragility Analysis: {analyzer.analyze_fragility(description)}")
