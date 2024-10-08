# File path: CryptIQ-Micro-Frontend/services/trading-service/historical_performance_analyzer.py

import pandas as pd

"""
Historical Performance Analyzer for Trading Strategies
"""

class HistoricalPerformanceAnalyzer:
    def __init__(self):
        pass

    def analyze_performance(self, trade_history: pd.DataFrame):
        """
        Analyze historical performance of trading strategies.
        Args:
            trade_history: DataFrame containing historical trade data.
        """
        total_return = trade_history['profit'].sum()
        max_drawdown = (trade_history['price'].cummax() - trade_history['price']).max()
        return {'total_return': total_return, 'max_drawdown': max_drawdown}

# Example usage
trade_history = pd.DataFrame({
    'price': [100, 110, 105, 120, 115],
    'profit': [10, 20, -15, 30, -5]
})
analyzer = HistoricalPerformanceAnalyzer()
print(analyzer.analyze_performance(trade_history))
