# File path: CryptIQ-Micro-Frontend/services/trading-service/smart_entry_exit_signal_aggregator.py

import pandas as pd

"""
Smart Entry-Exit Signal Aggregator
"""

class SmartEntryExitSignalAggregator:
    def __init__(self):
        self.signals = pd.DataFrame(columns=['strategy', 'entry_signal', 'exit_signal'])

    def add_signal(self, strategy: str, entry_signal: bool, exit_signal: bool):
        """
        Add entry and exit signals from a given strategy.
        Args:
            strategy: Name of the strategy generating the signal.
            entry_signal: Boolean indicating entry signal.
            exit_signal: Boolean indicating exit signal.
        """
        new_signal = pd.DataFrame([[strategy, entry_signal, exit_signal]], columns=self.signals.columns)
        self.signals = pd.concat([self.signals, new_signal], ignore_index=True)

    def aggregate_signals(self):
        """
        Aggregate entry and exit signals to generate consensus signals.
        """
        consensus_entry = self.signals['entry_signal'].sum() > len(self.signals) / 2
        consensus_exit = self.signals['exit_signal'].sum() > len(self.signals) / 2
        return {'consensus_entry': consensus_entry, 'consensus_exit': consensus_exit}

# Example usage
aggregator = SmartEntryExitSignalAggregator()
aggregator.add_signal('RSI Strategy', True, False)
aggregator.add_signal('MACD Strategy', False, True)
aggregator.add_signal('Moving Average Strategy', True, True)
print(aggregator.aggregate_signals())
