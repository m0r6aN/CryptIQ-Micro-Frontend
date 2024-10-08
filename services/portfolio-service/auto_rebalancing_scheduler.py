# File path: CryptIQ-Micro-Frontend/services/portfolio-service/auto_rebalancing_scheduler.py

from portfolio_optimizer import optimize_portfolio
import pandas as pd
import schedule
import time

"""
Automated Risk-Adjusted Rebalancing Scheduler
"""

class AutoRebalancingScheduler:
    def __init__(self, portfolio_data: pd.DataFrame, rebalance_interval: int = 15):
        self.portfolio_data = portfolio_data
        self.rebalance_interval = rebalance_interval

    def rebalance_portfolio(self):
        """
        Run optimization and rebalance portfolio at the specified interval.
        """
        optimized_weights = optimize_portfolio(self.portfolio_data)
        print(f"Rebalanced Portfolio: {optimized_weights}")

    def start_rebalancing(self):
        """
        Schedule rebalancing at the defined intervals.
        """
        schedule.every(self.rebalance_interval).minutes.do(self.rebalance_portfolio)
        while True:
            schedule.run_pending()
            time.sleep(1)

# Example usage
portfolio_data = pd.DataFrame({"Asset": ["BTC", "ETH", "USDT"], "Value": [5000, 3000, 2000]})
scheduler = AutoRebalancingScheduler(portfolio_data, rebalance_interval=10)
scheduler.start_rebalancing()
