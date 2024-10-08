# File path: CryptIQ-Micro-Frontend/services/trading-service/ai_trade_recommendations.py

from transformers import pipeline
import pandas as pd

"""
AI-Based Trade Recommendation Engine
"""

# Load NLP model for AI-based recommendations
recommendation_model = pipeline("text-classification", model="mrm8488/bert-small-finetuned-squadv2")

def generate_trade_recommendation(data: pd.DataFrame, context: str):
    """
    Generates trade recommendations based on contextual analysis of the market.
    Args:
        data: DataFrame with market data.
        context: Current market context or specific scenarios.
    """
    latest_price = data['close'].iloc[-1]
    question = f"What is the recommended trading action given that Bitcoin is currently priced at {latest_price} USD?"

    # Generate recommendation using NLP model
    recommendation = recommendation_model(question, context)
    return recommendation
