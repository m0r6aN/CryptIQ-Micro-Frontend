from transformers import pipeline

class AIBasedOrderBookDepthAnalyzer:
    def __init__(self):
        self.order_book_depth_analyzer = pipeline("text-generation", model="EleutherAI/gpt-neo-2.7B")

    def analyze_order_book_depth(self, order_book_description: str):
        order_book_depth_analysis = self.order_book_depth_analyzer(order_book_description, max_length=50, num_return_sequences=1)
        return order_book_depth_analysis[0]['generated_text']

analyzer = AIBasedOrderBookDepthAnalyzer()
description = "Analyze the order book depth for ETH on major exchanges to determine liquidity levels and support/resistance."
print(f"Order Book Depth Analysis: {analyzer.analyze_order_book_depth(description)}")
