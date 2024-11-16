from transformers import pipeline

class AIMultiAssetPortfolioHealthMonitor:
    def __init__(self):
        self.health_monitor = pipeline("text-generation", model="EleutherAI/gpt-neo-2.7B")

    def monitor_health(self, health_description: str):
        health_analysis = self.health_monitor(health_description, max_length=50, num_return_sequences=1)
        return health_analysis[0]['generated_text']

monitor = AIMultiAssetPortfolioHealthMonitor()
description = "The portfolio is currently showing high risk exposure, with multiple positions overleveraged and unstable market conditions."
print(f"Portfolio Health Analysis: {monitor.monitor_health(description)}")
