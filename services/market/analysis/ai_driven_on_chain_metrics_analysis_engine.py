from transformers import pipeline

class AIDrivenOnChainMetricsAnalysisEngine:
    def __init__(self):
        self.on_chain_analysis_engine = pipeline("text-generation", model="EleutherAI/gpt-neo-2.7B")

    def analyze_on_chain_metrics(self, metrics_description: str):
        metrics_analysis = self.on_chain_analysis_engine(metrics_description, max_length=50, num_return_sequences=1)
        return metrics_analysis[0]['generated_text']

analyzer = AIDrivenOnChainMetricsAnalysisEngine()
description = "Analyze on-chain metrics for BTC and ETH, including wallet activity, transaction volume, and network health."
print(f"On-Chain Metrics Analysis: {analyzer.analyze_on_chain_metrics(description)}")
