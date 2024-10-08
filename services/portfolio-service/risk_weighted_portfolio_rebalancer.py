# File path: CryptIQ-Micro-Frontend/services/portfolio-service/risk_weighted_portfolio_rebalancer.py

import pandas as pd

"""
Risk-Weighted Portfolio Rebalancer
"""

class RiskWeightedPortfolioRebalancer:
    def __init__(self, risk_weighting: dict):
        self.risk_weighting = risk_weighting

    def rebalance_portfolio(self, portfolio: pd.DataFrame):
        """
        Rebalance the portfolio based on risk-weighted allocations.
        Args:
            portfolio: DataFrame containing portfolio data.
        """
        total_value = portfolio['value'].sum()
        portfolio['target_allocation'] = portfolio['asset'].apply(lambda x: total_value * self.risk_weighting.get(x, 0))
        portfolio['adjustment_needed'] = portfolio['target_allocation'] - portfolio['value']
        return portfolio

# Example usage
portfolio = pd.DataFrame({
    'asset': ['BTC', 'ETH', 'LTC'],
    'value': [5000, 3000, 2000]
})
risk_weighting = {'BTC': 0.5, 'ETH': 0.3, 'LTC': 0.2}
rebalancer = RiskWeightedPortfolioRebalancer(risk_weighting)
print(rebalancer.rebalance_portfolio(portfolio))
