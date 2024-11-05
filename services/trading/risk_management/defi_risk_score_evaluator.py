# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/defi_risk_score_evaluator.py

import pandas as pd

"""
DeFi Risk Score Evaluator
"""

class DeFiRiskScoreEvaluator:
    def __init__(self, risk_factors: dict):
        self.risk_factors = risk_factors

    def evaluate_risk_scores(self, protocol_data: pd.DataFrame):
        """
        Evaluate DeFi protocol risk scores based on multiple risk factors.
        Args:
            protocol_data: DataFrame containing protocol risk data.
        """
        protocol_data['risk_score'] = protocol_data.apply(lambda row: self.calculate_risk_score(row), axis=1)
        return protocol_data

    def calculate_risk_score(self, row):
        """
        Calculate the risk score for a single protocol.
        """
        score = 0
        for factor, weight in self.risk_factors.items():
            score += row[factor] * weight
        return score

# Example usage
protocol_data = pd.DataFrame({
    'protocol': ['Compound', 'Aave', 'Uniswap', 'SushiSwap'],
    'liquidity': [500, 300, 200, 150],
    'security': [5, 4, 4, 3],
    'reputation': [4, 5, 3, 2]
})
risk_factors = {'liquidity': 0.4, 'security': 0.4, 'reputation': 0.2}
evaluator = DeFiRiskScoreEvaluator(risk_factors)
print(evaluator.evaluate_risk_scores(protocol_data))
