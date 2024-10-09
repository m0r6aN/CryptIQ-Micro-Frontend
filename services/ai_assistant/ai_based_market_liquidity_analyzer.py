from transformers import pipeline

class AIBasedMarketLiquidityAnalyzer:
    def __init__(self):
        self.liquidity_analyzer = pipeline("text-generation", model="EleutherAI/gpt-neo-2.7B")

    def analyze_liquidity(self, liquidity_description: str):
        liquidity_analysis = self.liquidity_analyzer(liquidity_description, max_length=50, num_return_sequences=1)
        return liquidity_analysis[0]['generated_text']

analyzer = AIBasedMarketLiquidityAnalyzer()
description = "The market liquidity for BTC is decreasing as trading volume declines across major exchanges."
print(f"Market Liquidity Analysis: {analyzer.analyze_liquidity(description)}")
