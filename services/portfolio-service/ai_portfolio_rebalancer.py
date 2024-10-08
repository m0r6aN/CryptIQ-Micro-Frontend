# File path: CryptIQ-Micro-Frontend/services/portfolio-service/ai_portfolio_rebalancer.py

from transformers import pipeline

"""
AI-Based Portfolio Rebalancing Advisor
"""

class AIPortfolioRebalancer:
    def __init__(self):
        self.rebalancer_model = pipeline("text-classification", model="distilbert-base-uncased")

    def recommend_rebalancing(self, portfolio_summary: str):
        """
        Provide rebalancing advice based on a summary of the current portfolio.
        """
        recommendation = self.rebalancer_model(portfolio_summary)
        return recommendation

# Example usage
rebalancer = AIPortfolioRebalancer()
portfolio_summary = "Current Portfolio: 50% BTC, 30% ETH, 20% USDT. Market is volatile."
print(rebalancer.recommend_rebalancing(portfolio_summary))
