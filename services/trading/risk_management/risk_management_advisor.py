# File path: CryptIQ-Micro-Frontend/services/trading-service/risk_management_advisor.py

import pandas as pd
from transformers import pipeline

"""
AI-Powered Risk Management Advisor
"""

class RiskManagementAdvisor:
    def __init__(self):
        self.risk_model = pipeline("text-classification", model="distilbert-base-uncased")

    def evaluate_risk(self, trade_context: str):
        """
        Analyze the trade context and provide risk management advice.
        Args:
            trade_context: A string describing the current trade scenario.
        """
        risk_advice = self.risk_model(trade_context)
        return risk_advice[0]['label'], risk_advice[0]['score']

    def recommend_stop_loss(self, data: pd.DataFrame):
        """
        Recommend a dynamic stop-loss level based on market volatility.
        """
        current_price = data['close'].iloc[-1]
        atr = data['close'].rolling(14).std().iloc[-1]  # Use standard deviation as a proxy for volatility
        stop_loss = current_price - (atr * 1.5)  # Set stop-loss 1.5x ATR below the current price
        return stop_loss

    def recommend_take_profit(self, data: pd.DataFrame, risk_reward_ratio: float = 2.0):
        """
        Recommend a dynamic take-profit level based on a risk-reward ratio.
        """
        stop_loss = self.recommend_stop_loss(data)
        current_price = data['close'].iloc[-1]
        take_profit = current_price + (current_price - stop_loss) * risk_reward_ratio
        return take_profit

# Example usage
advisor = RiskManagementAdvisor()
data = pd.DataFrame({'close': [100, 102, 105, 103, 107]})
print(f"Recommended Stop Loss: {advisor.recommend_stop_loss(data)}")
print(f"Recommended Take Profit: {advisor.recommend_take_profit(data)}")
print(advisor.evaluate_risk("The market is showing signs of increased volatility."))
