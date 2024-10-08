# File path: CryptIQ-Micro-Frontend/services/trading-service/dynamic_leverage_optimizer.py

"""
Dynamic Leverage Optimizer
"""

class DynamicLeverageOptimizer:
    def __init__(self, max_leverage: float = 10.0, min_leverage: float = 1.0):
        self.max_leverage = max_leverage
        self.min_leverage = min_leverage

    def optimize_leverage(self, risk_level: float):
        """
        Optimize leverage based on the given risk level.
        Args:
            risk_level: Risk level (0.0 to 1.0) where 1.0 is maximum risk tolerance.
        """
        return self.min_leverage + (self.max_leverage - self.min_leverage) * risk_level

# Example usage
optimizer = DynamicLeverageOptimizer(max_leverage=5.0, min_leverage=1.0)
print(f"Optimized Leverage: {optimizer.optimize_leverage(0.8)}x")
