# File path: CryptIQ-Micro-Frontend/services/trading-service/multi_strategy_trade_signal_comparator.py

import pandas as pd

"""
Multi-Strategy Trade Signal Comparator
"""

class MultiStrategyTradeSignalComparator:
    def __init__(self):
        self.signals = pd.DataFrame(columns=['strategy', 'signal'])

    def add_trade_signal(self, strategy: str, signal: str):
        """
        Add a trade signal for comparison.
        Args:
            strategy: Name of the strategy.
            signal: Trade signal ('buy', 'sell', 'hold').
        """
        new_signal = pd.DataFrame([[strategy, signal]], columns=self.signals.columns)
        self.signals = pd.concat([self.signals, new_signal], ignore_index=True)

    def compare_signals(self):
        """
        Compare trade signals and find the most common consensus.
        """
        signal_counts = self.signals['signal'].value_counts()
        consensus_signal = signal_counts.idxmax()
        return f"Consensus Signal: {consensus_signal} ({signal_counts[consensus_signal]} votes)"

# Example usage
comparator = MultiStrategyTradeSignalComparator()
comparator.add_trade_signal('RSI Strategy', 'buy')
comparator.add_trade_signal('MACD Strategy', 'sell')
comparator.add_trade_signal('Sentiment Analysis', 'buy')
print(comparator.compare_signals())
