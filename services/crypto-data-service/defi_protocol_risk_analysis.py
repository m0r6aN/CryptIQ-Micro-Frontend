# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/defi_protocol_risk_analysis.py

import pandas as pd

"""
DeFi Protocol Risk Analysis Engine
"""

class DeFiProtocolRiskAnalysisEngine:
    def __init__(self, risk_weighting_factors: dict):
        self.risk_weighting_factors = risk_weighting_factors

    def analyze_protocol_risk(self, protocol_data: pd.DataFrame):
        """
        Analyze the risk of DeFi protocols based on various factors.
        Args:
            protocol_data: DataFrame containing protocol risk attributes.
        """
        protocol_data['risk_score'] = protocol_data.apply(lambda row: self.calculate_risk_score(row), axis=1)
        return protocol_data.sort_values(by='risk_score', ascending=False)

    def calculate_risk_score(self, protocol_row):
        """
        Calculate risk score for a single protocol based on weighting factors.
        """
        risk_score = 0
        for factor, weight in self.risk_weighting_factors.items():
            risk_score += row[factor] * weight
        return risk_score

# Example usage
protocol_data = pd.DataFrame({
    'protocol': ['Compound', 'Aave', 'Uniswap', 'SushiSwap'],
    'liquidity': [500, 300, 200, 150],
    'reputation': [4, 5, 3, 2],
    'security': [5, 4, 4, 3],
    'user_base': [5, 4, 4, 3]
})
risk_weighting_factors = {'liquidity': 0.4, 'reputation': 0.3, 'security': 0.2, 'user_base': 0.1}
engine = DeFiProtocolRiskAnalysisEngine(risk_weighting_factors)
print(engine.analyze_protocol_risk(protocol_data))
