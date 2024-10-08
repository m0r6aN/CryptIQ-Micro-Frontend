# File path: CryptIQ-Micro-Frontend/services/trading-service/strategy_scheduler.py

import schedule
import time
from strategy_orchestrator import StrategyOrchestrator
import pandas as pd

"""
Intelligent Strategy Scheduler
"""

class StrategyScheduler:
    def __init__(self, orchestrator: StrategyOrchestrator):
        self.orchestrator = orchestrator

    def schedule_strategy(self, strategy_name: str, interval: int, data: pd.DataFrame):
        """
        Schedule a specific strategy to run at a defined interval.
        Args:
            strategy_name: Name of the strategy to execute.
            interval: Time interval in minutes.
            data: Market data to use for the strategy.
        """
        schedule.every(interval).minutes.do(self.orchestrator.execute, strategy_name, data)

    def run_scheduled_strategies(self):
        """
        Run the scheduler to execute strategies at their defined intervals.
        """
        while True:
            schedule.run_pending()
            time.sleep(1)

# Example usage
orchestrator = StrategyOrchestrator()
scheduler = StrategyScheduler(orchestrator)
scheduler.schedule_strategy("bullish_strategy", interval=5, data=pd.DataFrame())  # Replace with actual data
scheduler.run_scheduled_strategies()
