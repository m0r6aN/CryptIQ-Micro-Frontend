# File path: CryptIQ-Micro-Frontend/services/trading-service/strategy_orchestrator.py

import pandas as pd
from strategy_selector import select_strategy
from market_condition_detector import detect_market_condition

class StrategyOrchestrator:
    def __init__(self):
        self.current_strategy = None
        self.current_condition = None

    def execute(self, data: pd.DataFrame):
        """
        Execute the selected strategy and adapt if market condition changes.
        """
        # Detect current market condition
        new_condition = detect_market_condition(data)

        # If condition changes, switch strategy
        if new_condition != self.current_condition:
            self.current_condition = new_condition
            self.current_strategy = select_strategy(new_condition)
            print(f"Switched to {self.current_strategy.__name__} due to {new_condition} condition.")

        # Execute the current strategy
        return self.current_strategy(data)

# Initialize orchestrator
orchestrator = StrategyOrchestrator()
