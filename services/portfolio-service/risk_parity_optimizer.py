# File path: CryptIQ-Micro-Frontend/services/portfolio-service/risk_parity_optimizer.py

import pandas as pd
import numpy as np

"""
Portfolio Risk Parity Optimizer
"""

class RiskParityOptimizer:
    def __init__(self, returns: pd.DataFrame):
        self.returns = returns

    def calculate_risk_contributions(self, weights: np.array):
        """
        Calculate risk contributions for each asset in the portfolio.
        """
        cov_matrix = self.returns.cov()
        portfolio_variance = np.dot(weights.T, np.dot(cov_matrix, weights))
        marginal_contributions = np.dot(cov_matrix, weights) / portfolio_variance
        return marginal_contributions * weights

    def optimize(self):
        """
        Optimize the portfolio weights to achieve risk parity.
        """
        num_assets = self.returns.shape[1]
        weights = np.ones(num_assets) / num_assets  # Initial equal weight

        for _ in range(100):  # Simple iterative optimization
            risk_contributions = self.calculate_risk_contributions(weights)
            weights -= 0.1 * (risk_contributions - 1 / num_assets)
            weights = np.clip(weights, 0, 1)  # Ensure weights remain between 0 and 1

        return weights / np.sum(weights)  # Normalize weights to sum to 1

# Example usage
returns = pd.DataFrame({
    'BTC': [0.02, -0.01, 0.03, 0.04, -0.02],
    'ETH': [0.03, 0.01, -0.02, 0.02, 0.01],
    'LTC': [-0.01, 0.02, 0.01, 0.03, 0.02]
})
optimizer = RiskParityOptimizer(returns)
print(optimizer.optimize())
