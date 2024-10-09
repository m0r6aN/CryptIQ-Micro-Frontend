from transformers import pipeline

class AISmartMarketCycleAnalyzer:
    def __init__(self):
        self.cycle_analyzer = pipeline("text-generation", model="EleutherAI/gpt-neo-2.7B")

    def analyze_cycle(self, cycle_description: str):
        cycle_analysis = self.cycle_analyzer(cycle_description, max_length=50, num_return_sequences=1)
        return cycle_analysis[0]['generated_text']

analyzer = AISmartMarketCycleAnalyzer()
description = "The market is currently in the late stage of a bullish cycle, with declining momentum and increasing risk of a reversal."
print(f"Market Cycle Analysis: {analyzer.analyze_cycle(description)}")
