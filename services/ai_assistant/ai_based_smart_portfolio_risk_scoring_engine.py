# File path: CryptIQ-Micro-Frontend/services/ai_assistant/ai_based_smart_portfolio_risk_scoring_engine.py

from transformers import pipeline

"""
AI-Based Smart Portfolio Risk Scoring Engine
"""

class AISmartPortfolioRiskScoringEngine:
    def __init__(self):
        self.risk_scorer = pipeline("text-generation", model="EleutherAI/gpt-neo-2.7B")

    def score_risk(self, portfolio_description: str):
        """
        Score portfolio risk based on a description of the portfolio's structure.
        Args:
            portfolio_description: Text description of the portfolio.
        """
        risk_score = self.risk_scorer(portfolio_description, max_length=50, num_return_sequences=1)
        return risk_score[0]['generated_text']

# Example usage
scorer = AISmartPortfolioRiskScoringEngine()
portfolio_description = "The portfolio is heavily weighted in volatile assets like BTC and ETH, with limited exposure to stablecoins."
print(f"Portfolio Risk Score: {scorer.score_risk(portfolio_description)}")
