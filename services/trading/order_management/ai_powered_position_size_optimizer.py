from transformers import pipeline

class AIPoweredPositionSizeOptimizer:
    def __init__(self):
        self.position_size_optimizer = pipeline("text-generation", model="EleutherAI/gpt-neo-2.7B")

    def optimize_position_size(self, position_description: str):
        optimization = self.position_size_optimizer(position_description, max_length=50, num_return_sequences=1)
        return optimization[0]['generated_text']

optimizer = AIPoweredPositionSizeOptimizer()
description = "Determine the optimal position size for a BTC trade, given a target risk percentage of 2%."
print(f"Position Size Optimization: {optimizer.optimize_position_size(description)}")
