# File path: CryptIQ-Micro-Frontend/services/trading-service/smart_trade_signal_aggregator.py

import pandas as pd

"""
Smart Trade Signal Aggregator
"""

class SmartTradeSignalAggregator:
    def __init__(self):
        self.signals = pd.DataFrame(columns=['strategy', 'signal'])

    def add_signal(self, strategy: str, signal: str):
        """
        Add a new trade signal from a given strategy.
        Args:
            strategy: Name of the strategy generating the signal.
            signal: Trade signal ('buy', 'sell', 'hold').
        """
        new_signal = pd.DataFrame([[strategy, signal]], columns=self.signals.columns)
        self.signals = pd.concat([self.signals, new_signal], ignore_index=True)

    def aggregate_signals(self):
        """
        Aggregate trade signals to form a consensus signal.
        """
        if len(self.signals) == 0:
            return "No signals"

        signal_counts = self.signals['signal'].value_counts()
        consensus_signal = signal_counts.idxmax()
        return f"Consensus Signal: {consensus_signal} ({signal_counts[consensus_signal]} votes)"

# Example usage
aggregator = SmartTradeSignalAggregator()
aggregator.add_signal('RSI Strategy', 'buy')
aggregator.add_signal('MACD Strategy', 'sell')
aggregator.add_signal('Sentiment Analysis', 'buy')
print(aggregator.aggregate_signals())
