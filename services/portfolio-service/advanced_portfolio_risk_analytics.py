# File path: CryptIQ-Micro-Frontend/services/portfolio-service/advanced_portfolio_risk_analytics.py

import pandas as pd

"""
Advanced Portfolio Risk Analytics
"""

class AdvancedPortfolioRiskAnalytics:
    def __init__(self, risk_free_rate: float = 0.01):
        self.risk_free_rate = risk_free_rate

    def calculate_sharpe_ratio(self, returns: pd.DataFrame):
        """
        Calculate Sharpe ratio for each asset in the portfolio.
        Args:
            returns: DataFrame containing returns data for assets.
        """
        mean_returns = returns.mean()
        std_returns = returns.std()
        sharpe_ratios = (mean_returns - self.risk_free_rate) / std_returns
        return sharpe_ratios

    def calculate_max_drawdown(self, price_data: pd.DataFrame):
        """
        Calculate the maximum drawdown for each asset in the portfolio.
        Args:
            price_data: DataFrame containing historical price data.
        """
        cumulative_return = price_data / price_data.iloc[0] - 1
        max_drawdown = cumulative_return.cummax() - cumulative_return
        return max_drawdown.max()

# Example usage
returns = pd.DataFrame({
    'BTC': [0.02, -0.01, 0.03, 0.01, -0.02],
    'ETH': [0.01, 0.02, -0.01, 0.03, 0.01],
    'LTC': [-0.01, 0.01, 0.02, -0.02, 0.02]
})
price_data = pd.DataFrame({
    'BTC': [10000, 10200, 10500, 10700, 10400],
    'ETH': [300, 310, 305, 315, 320],
    'LTC': [50, 55, 53, 57, 60]
})
analytics = AdvancedPortfolioRiskAnalytics(risk_free_rate=0.02)
print("Sharpe Ratios:", analytics.calculate_sharpe_ratio(returns))
print("Max Drawdown:", analytics.calculate_max_drawdown(price_data))
