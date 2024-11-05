# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/smart_liquidity_mining_optimizer.py

import pandas as pd

"""
Smart Liquidity Mining Optimization Engine
"""

class SmartLiquidityMiningOptimizer:
    def __init__(self, reward_factor: float = 0.1):
        self.reward_factor = reward_factor

    def optimize_liquidity_mining(self, pool_data: pd.DataFrame, risk_tolerance: str = 'medium'):
        """
        Optimize liquidity mining strategy based on risk tolerance.
        Args:
            pool_data: DataFrame containing pool data.
            risk_tolerance: User's risk tolerance ('low', 'medium', 'high').
        """
        if risk_tolerance == 'low':
            optimal_pools = pool_data[pool_data['risk_score'] <= 2]
        elif risk_tolerance == 'medium':
            optimal_pools = pool_data[(pool_data['risk_score'] > 2) & (pool_data['risk_score'] <= 4)]
        else:
            optimal_pools = pool_data[pool_data['risk_score'] > 4]

        optimal_pools['reward_estimation'] = optimal_pools['liquidity'] * self.reward_factor
        return optimal_pools.sort_values(by='reward_estimation', ascending=False)

# Example usage
pool_data = pd.DataFrame({
    'pool_name': ['Pool A', 'Pool B', 'Pool C', 'Pool D'],
    'liquidity': [1000, 5000, 2000, 3000],
    'risk_score': [1, 3, 4, 5]
})
optimizer = SmartLiquidityMiningOptimizer(reward_factor=0.15)
print(optimizer.optimize_liquidity_mining(pool_data, risk_tolerance='high'))
