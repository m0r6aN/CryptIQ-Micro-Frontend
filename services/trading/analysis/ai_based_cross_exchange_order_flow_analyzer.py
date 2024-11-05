from transformers import pipeline

class AIBasedCrossExchangeOrderFlowAnalyzer:
    def __init__(self):
        self.order_flow_analyzer = pipeline("text-generation", model="EleutherAI/gpt-neo-2.7B")

    def analyze_order_flow(self, order_flow_description: str):
        order_flow_analysis = self.order_flow_analyzer(order_flow_description, max_length=50, num_return_sequences=1)
        return order_flow_analysis[0]['generated_text']

analyzer = AIBasedCrossExchangeOrderFlowAnalyzer()
description = "Analyze the order flow across multiple exchanges for BTC during the recent spike in trading activity."
print(f"Cross-Exchange Order Flow Analysis: {analyzer.analyze_order_flow(description)}")
