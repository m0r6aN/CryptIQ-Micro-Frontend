# File path: CryptIQ-Micro-Frontend/services/trading-service/strategy_tester.py

import pandas as pd
from backtest_engine import backtest_trade_execution
from strategy_selector import select_strategy

"""
Dynamic Strategy Tester with Auto-Report Generation
"""

class StrategyTester:
    def __init__(self, strategies: list, data: pd.DataFrame):
        self.strategies = strategies
        self.data = data

    def run_tests(self):
        """
        Runs backtests on all provided strategies and generates performance reports.
        """
        report = {}
        for strategy_name in self.strategies:
            strategy_function = select_strategy(strategy_name)
            results = backtest_trade_execution(strategy_function, self.data)
            report[strategy_name] = results

        return report

    def generate_report(self, report_data: dict):
        """
        Generate a comprehensive strategy performance report.
        """
        report_df = pd.DataFrame.from_dict(report_data, orient='index')
        report_df.to_csv("strategy_performance_report.csv", index=True)
        print("Strategy Performance Report Generated: strategy_performance_report.csv")

# Example usage
tester = StrategyTester(["rsi_strategy", "macd_strategy"], pd.DataFrame())  # Replace with actual data
results = tester.run_tests()
tester.generate_report(results)
