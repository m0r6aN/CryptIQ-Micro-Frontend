# File path: CryptIQ-Micro-Frontend/services/ai_assistant/market_forecasting_agent.py

from transformers import pipeline

"""
AI-Driven Market Forecasting Agent
"""

class MarketForecastingAgent:
    def __init__(self):
        self.forecasting_model = pipeline("text-generation", model="gpt2")

    def generate_forecast(self, market_summary: str):
        """
        Generate a market forecast based on a textual summary of current conditions.
        Args:
            market_summary: Text summary of current market conditions.
        """
        forecast = self.forecasting_model(market_summary, max_length=100, num_return_sequences=1)
        return forecast[0]['generated_text']

# Example usage
agent = MarketForecastingAgent()
market_summary = "Bitcoin is showing signs of increased buying pressure, with strong support at $50,000."
print(f"Market Forecast: {agent.generate_forecast(market_summary)}")
