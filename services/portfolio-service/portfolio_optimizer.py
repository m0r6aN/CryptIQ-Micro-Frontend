# File path: CryptIQ-Micro-Frontend/services/portfolio-service/portfolio_optimizer.py

import pandas as pd
import numpy as np

"""
Portfolio Analysis and Optimization Service
"""
def calculate_sharpe_ratio(returns: pd.Series, risk_free_rate: float = 0.01):
    """
    Calculate Sharpe Ratio of a portfolio.
    Args:
        returns: Series of returns (e.g., daily returns).
        risk_free_rate: Risk-free rate for Sharpe ratio calculation.
    """
    excess_returns = returns - risk_free_rate
    sharpe_ratio = np.mean(excess_returns) / np.std(excess_returns)
    return sharpe_ratio

def mean_variance_optimization(returns: pd.DataFrame, risk_tolerance: float = 0.5):
    """
    Calculate optimal portfolio weights using Mean-Variance Optimization.
    Args:
        returns: DataFrame of asset returns.
        risk_tolerance: Risk tolerance level (0.0 - conservative, 1.0 - aggressive).
    """
    cov_matrix = returns.cov()
    mean_returns = returns.mean()
    num_assets = len(mean_returns)

    # Calculate weights using risk tolerance and covariance
    weights = np.dot(np.linalg.inv(cov_matrix), mean_returns) * risk_tolerance
    weights /= np.sum(weights)  # Normalize weights to sum to 1

    return dict(zip(returns.columns, weights))

def optimize_portfolio(historical_data: pd.DataFrame):
    """
    Optimizes a portfolio based on historical returns.
    """
    returns = historical_data.pct_change().dropna()
    optimal_weights = mean_variance_optimization(returns)
    sharpe_ratio = calculate_sharpe_ratio(returns.sum(axis=1))

    return {"optimal_weights": optimal_weights, "sharpe_ratio": sharpe_ratio}
