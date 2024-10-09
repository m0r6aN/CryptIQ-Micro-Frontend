from transformers import pipeline

class AIDrivenTradeImpactAnalysisEngine:
    def __init__(self):
        self.trade_impact_analyzer = pipeline("text-generation", model="EleutherAI/gpt-neo-2.7B")

    def analyze_trade_impact(self, trade_description: str):
        trade_impact = self.trade_impact_analyzer(trade_description, max_length=50, num_return_sequences=1)
        return trade_impact[0]['generated_text']

analyzer = AIDrivenTradeImpactAnalysisEngine()
description = "Assess the impact of a large buy order in BTC on overall market liquidity and slippage."
print(f"Trade Impact Analysis: {analyzer.analyze_trade_impact(description)}")
