# File path: CryptIQ-Micro-Frontend/services/portfolio-service/dynamic_risk_parity_optimizer.py

import pandas as pd

"""
Dynamic Risk Parity Portfolio Optimizer
"""

class DynamicRiskParityOptimizer:
    def __init__(self, risk_target: float = 0.1):
        self.risk_target = risk_target

    def optimize_portfolio(self, returns: pd.DataFrame):
        """
        Optimize portfolio allocation using dynamic risk parity.
        Args:
            returns: DataFrame containing historical returns data for assets.
        """
        volatilities = returns.std()
        weights = (1 / volatilities) / sum(1 / volatilities)
        scaled_weights = weights * self.risk_target / weights.sum()
        return scaled_weights

# Example usage
returns = pd.DataFrame({
    'BTC': [0.02, -0.01, 0.03, 0.01, -0.02],
    'ETH': [0.01, 0.02, -0.01, 0.03, 0.01],
    'LTC': [-0.01, 0.01, 0.02, -0.02, 0.02]
})
optimizer = DynamicRiskParityOptimizer(risk_target=0.1)
print("Optimized Weights:", optimizer.optimize_portfolio(returns))
