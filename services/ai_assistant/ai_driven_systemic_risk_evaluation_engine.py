from transformers import pipeline

class AIDrivenSystemicRiskEvaluationEngine:
    def __init__(self):
        self.systemic_risk_engine = pipeline("text-generation", model="EleutherAI/gpt-neo-2.7B")

    def evaluate_systemic_risk(self, risk_description: str):
        risk_evaluation = self.systemic_risk_engine(risk_description, max_length=50, num_return_sequences=1)
        return risk_evaluation[0]['generated_text']

evaluator = AIDrivenSystemicRiskEvaluationEngine()
description = "Evaluate systemic risk for the entire crypto market, considering interconnectedness between major DeFi protocols."
print(f"Systemic Risk Evaluation: {evaluator.evaluate_systemic_risk(description)}")
