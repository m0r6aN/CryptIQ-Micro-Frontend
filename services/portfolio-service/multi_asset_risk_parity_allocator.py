# File path: CryptIQ-Micro-Frontend/services/portfolio-service/multi_asset_risk_parity_allocator.py

import pandas as pd

"""
Multi-Asset Risk Parity Allocator
"""

class MultiAssetRiskParityAllocator:
    def __init__(self, risk_weighting: dict):
        self.risk_weighting = risk_weighting

    def allocate_risk_parity(self, portfolio: pd.DataFrame):
        """
        Allocate assets in a risk parity manner based on target risk weightings.
        Args:
            portfolio: DataFrame containing asset data.
        """
        total_value = portfolio['value'].sum()
        portfolio['target_allocation'] = portfolio['asset'].apply(lambda x: total_value * self.risk_weighting.get(x, 0))
        portfolio['allocation_difference'] = portfolio['target_allocation'] - portfolio['value']
        return portfolio

# Example usage
portfolio = pd.DataFrame({
    'asset': ['BTC', 'ETH', 'LTC'],
    'value': [5000, 3000, 2000]
})
risk_weighting = {'BTC': 0.4, 'ETH': 0.35, 'LTC': 0.25}
allocator = MultiAssetRiskParityAllocator(risk_weighting)
print(allocator.allocate_risk_parity(portfolio))
