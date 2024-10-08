# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/liquidity_shock_detector.py

import pandas as pd

"""
Liquidity Shock Detector for DeFi
"""

class LiquidityShockDetector:
    def __init__(self, shock_threshold: float = 0.15):
        self.shock_threshold = shock_threshold

    def detect_liquidity_shocks(self, liquidity_data: pd.DataFrame):
        """
        Detect sudden liquidity shocks in DeFi pools.
        Args:
            liquidity_data: DataFrame containing historical liquidity levels.
        """
        liquidity_data['liquidity_change'] = liquidity_data['liquidity'].pct_change()
        shocks = liquidity_data[liquidity_data['liquidity_change'].abs() > self.shock_threshold]
        return shocks

# Example usage
liquidity_data = pd.DataFrame({'liquidity': [1000, 1200, 900, 1100, 1300, 800, 700]})
detector = LiquidityShockDetector(shock_threshold=0.20)
print("Liquidity Shocks:", detector.detect_liquidity_shocks(liquidity_data))
