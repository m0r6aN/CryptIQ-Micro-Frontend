# File path: CryptIQ-Micro-Frontend/services/trading-service/smart_leverage_rebalancer.py

import pandas as pd

class SmartLeverageRebalancer:
    def __init__(self, leverage_threshold: float = 1.5):
        self.leverage_threshold = leverage_threshold

    def rebalance_leverage(self, data: pd.DataFrame):
        """
        Rebalance leverage dynamically based on current leverage ratios.
        """
        data['leverage_adjustment'] = data['current_leverage'] - self.leverage_threshold
        rebalanced_positions = data[data['leverage_adjustment'].abs() > 0.1]  # Only adjust if outside threshold
        return rebalanced_positions

# Example usage
data = pd.DataFrame({
    'symbol': ['BTC/USD', 'ETH/USD', 'LTC/USD'],
    'current_leverage': [2.0, 1.0, 1.7]
})
rebalancer = SmartLeverageRebalancer(leverage_threshold=1.5)
print(rebalancer.rebalance_leverage(data))
