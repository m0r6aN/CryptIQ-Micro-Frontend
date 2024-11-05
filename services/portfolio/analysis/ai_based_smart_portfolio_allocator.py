# File path: CryptIQ-Micro-Frontend/services/ai_assistant/ai_based_smart_portfolio_allocator.py

from transformers import pipeline

"""
AI-Based Smart Portfolio Allocator
"""

class AISmartPortfolioAllocator:
    def __init__(self):
        self.portfolio_allocator = pipeline("text-generation", model="EleutherAI/gpt-neo-2.7B")

    def allocate_portfolio(self, investment_goals: str):
        """
        Allocate a smart portfolio based on user-defined investment goals.
        Args:
            investment_goals: Text description of the investment goals.
        """
        allocation = self.portfolio_allocator(investment_goals, max_length=50, num_return_sequences=1)
        return allocation[0]['generated_text']

# Example usage
allocator = AISmartPortfolioAllocator()
goals = "I want to build a balanced crypto portfolio focused on long-term growth with low volatility."
print(f"Suggested Portfolio Allocation: {allocator.allocate_portfolio(goals)}")
