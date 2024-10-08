# File path: CryptIQ-Micro-Frontend/services/portfolio-service/risk_weighted_optimizer.py

import pandas as pd
import numpy as np

class RiskWeightedPortfolioOptimizer:
    def __init__(self, returns: pd.DataFrame):
        self.returns = returns

    def optimize_weights(self):
        """
        Optimize portfolio weights based on risk parity.
        """
        cov_matrix = self.returns.cov()
        risk_contributions = np.diag(cov_matrix) / np.sum(np.diag(cov_matrix))
        weights = risk_contributions / np.sum(risk_contributions)
        return weights

# Example usage
returns = pd.DataFrame({
    'BTC': [0.02, -0.01, 0.03, 0.04, -0.02],
    'ETH': [0.03, 0.01, -0.02, 0.02, 0.01],
    'LTC': [-0.01, 0.02, 0.01, 0.03, 0.02]
})
optimizer = RiskWeightedPortfolioOptimizer(returns)
print(f"Optimized Weights: {optimizer.optimize_weights()}")
