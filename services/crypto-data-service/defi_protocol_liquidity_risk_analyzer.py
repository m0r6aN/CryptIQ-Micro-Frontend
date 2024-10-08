# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/defi_protocol_liquidity_risk_analyzer.py

import pandas as pd

"""
 DeFi Protocol Liquidity Risk Analyzer
"""

class DeFiProtocolLiquidityRiskAnalyzer:
    def __init__(self, risk_threshold: float = 0.2):
        self.risk_threshold = risk_threshold

    def analyze_liquidity_risk(self, protocol_data: pd.DataFrame):
        """
        Analyze liquidity risk for DeFi protocols based on threshold.
        Args:
            protocol_data: DataFrame containing protocol liquidity data.
        """
        protocol_data['liquidity_change'] = protocol_data['liquidity'].pct_change()
        high_risk_protocols = protocol_data[protocol_data['liquidity_change'].abs() > self.risk_threshold]
        return high_risk_protocols

# Example usage
protocol_data = pd.DataFrame({
    'protocol': ['Compound', 'Aave', 'Uniswap', 'SushiSwap'],
    'liquidity': [500, 300, 250, 100, 150, 200, 180, 220]
})
analyzer = DeFiProtocolLiquidityRiskAnalyzer(risk_threshold=0.3)
print("High-Risk Protocols:", analyzer.analyze_liquidity_risk(protocol_data))
