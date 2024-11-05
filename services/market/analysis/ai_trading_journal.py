# File path: CryptIQ-Micro-Frontend/services/ai_assistant/ai_trading_journal.py

from transformers import pipeline

"""
AI-Powered Trading Journal
"""

class AITradingJournal:
    def __init__(self):
        self.journal_model = pipeline("summarization")

    def summarize_trades(self, trade_history: str):
        """
        Summarize trade history into key insights and patterns.
        Args:
            trade_history: Textual description of recent trades.
        """
        summary = self.journal_model(trade_history, max_length=100, min_length=30, do_sample=False)
        return summary[0]['summary_text']

# Example usage
journal = AITradingJournal()
trade_history = """
Trade 1: Buy BTC at $50000, Sold at $52000. Profit: $2000.
Trade 2: Buy ETH at $3000, Sold at $3500. Profit: $500.
Trade 3: Short BTC at $60000, Covered at $58000. Profit: $2000.
"""
print(f"Trade Summary: {journal.summarize_trades(trade_history)}")
