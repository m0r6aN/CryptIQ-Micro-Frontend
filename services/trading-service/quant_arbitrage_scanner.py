# File path: CryptIQ-Micro-Frontend/services/trading-service/quant_arbitrage_scanner.py

import pandas as pd

"""
Quantitative Arbitrage Opportunity Scanner
"""

class QuantArbitrageScanner:
    def __init__(self, spread_threshold: float = 0.01):
        self.spread_threshold = spread_threshold

    def scan_opportunities(self, data: pd.DataFrame):
        """
        Scan for arbitrage opportunities between exchanges based on spread.
        Args:
            data: DataFrame containing bid and ask prices from different exchanges.
        """
        data['spread'] = data['ask'] - data['bid']
        opportunities = data[data['spread'] / data['bid'] > self.spread_threshold]
        return opportunities

# Example usage
data = pd.DataFrame({
    'exchange': ['Binance', 'Kraken', 'Coinbase'],
    'bid': [100, 101, 99],
    'ask': [102, 103, 101]
})
scanner = QuantArbitrageScanner(spread_threshold=0.015)
print(scanner.scan_opportunities(data))
