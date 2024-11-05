from transformers import pipeline

class AIPoweredMarketReactionToLargeOrdersAnalyzer:
    def __init__(self):
        self.reaction_analyzer = pipeline("text-generation", model="EleutherAI/gpt-neo-2.7B")

    def analyze_market_reaction(self, order_description: str):
        reaction_analysis = self.reaction_analyzer(order_description, max_length=50, num_return_sequences=1)
        return reaction_analysis[0]['generated_text']

analyzer = AIPoweredMarketReactionToLargeOrdersAnalyzer()
description = "Analyze market reaction to large BTC buy orders, considering order book changes, price movements, and sentiment shifts."
print(f"Market Reaction Analysis: {analyzer.analyze_market_reaction(description)}")
