# File path: CryptIQ-Micro-Frontend/services/portfolio-service/multi_asset_portfolio_drawdown_analyzer.py

import pandas as pd

"""
Multi-Asset Portfolio Drawdown Analyzer
"""

class MultiAssetPortfolioDrawdownAnalyzer:
    def __init__(self):
        pass

    def analyze_drawdown(self, portfolio: pd.DataFrame):
        """
        Analyze drawdown for a multi-asset portfolio.
        Args:
            portfolio: DataFrame containing portfolio asset values.
        """
        portfolio['cumulative_value'] = portfolio['value'].cumsum()
        portfolio['drawdown'] = portfolio['cumulative_value'].cummax() - portfolio['cumulative_value']
        return portfolio

# Example usage
portfolio = pd.DataFrame({
    'asset': ['BTC', 'ETH', 'LTC'],
    'value': [10000, 5000, 3000]
})
analyzer = MultiAssetPortfolioDrawdownAnalyzer()
print(analyzer.analyze_drawdown(portfolio))
