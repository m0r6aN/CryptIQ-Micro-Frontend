from transformers import pipeline

class AIPoweredMultiAssetOrderRoutingEngine:
    def __init__(self):
        self.order_routing_engine = pipeline("text-generation", model="EleutherAI/gpt-neo-2.7B")

    def route_order(self, routing_description: str):
        routing_result = self.order_routing_engine(routing_description, max_length=50, num_return_sequences=1)
        return routing_result[0]['generated_text']

engine = AIPoweredMultiAssetOrderRoutingEngine()
description = "Determine the optimal order routing strategy for a large multi-asset trade, considering slippage and liquidity."
print(f"Order Routing Strategy: {engine.route_order(description)}")
