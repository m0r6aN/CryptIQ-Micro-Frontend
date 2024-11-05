# File path: CryptIQ-Micro-Frontend/services/trading-service/strategy_optimizer.py

import pandas as pd
import random

# Define a basic optimizer for strategy parameters
def optimize_strategy(strategy_function, data: pd.DataFrame, iterations: int = 100):
    """
    Optimizes strategy parameters using a brute-force search.
    Args:
        strategy_function: Function to evaluate a trading strategy.
        data: Historical OHLCV data.
        iterations: Number of random configurations to test.
    """
    best_config = None
    best_performance = -float('inf')
    
    # Define parameter ranges
    param_ranges = {
        "rsi_period": [10, 14, 20],
        "ema_short": [5, 10, 15],
        "ema_long": [20, 30, 50]
    }

    # Run optimization
    for _ in range(iterations):
        config = {param: random.choice(values) for param, values in param_ranges.items()}
        performance = strategy_function(data, config)

        if performance > best_performance:
            best_performance = performance
            best_config = config

    return best_config, best_performance
