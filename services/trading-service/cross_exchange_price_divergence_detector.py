# File path: CryptIQ-Micro-Frontend/services/trading-service/cross_exchange_price_divergence_detector.py

import ccxt
import pandas as pd

"""
Cross-Exchange Price Divergence Detector
"""

class CrossExchangePriceDivergenceDetector:
    def __init__(self, exchanges: list, trading_pair: str):
        self.exchanges = exchanges
        self.trading_pair = trading_pair

    def detect_price_divergence(self):
        """
        Detect significant price divergences across multiple exchanges.
        """
        prices = {}
        for exchange in self.exchanges:
            try:
                ticker = exchange.fetch_ticker(self.trading_pair)
                prices[exchange.name] = ticker['last']
            except Exception as e:
                prices[exchange.name] = f"Error: {e}"

        price_df = pd.DataFrame(prices.items(), columns=['Exchange', 'Price'])
        price_df['price_diff'] = price_df['Price'].diff().abs()
        significant_divergence = price_df[price_df['price_diff'] > 10]  # 10-unit price difference threshold
        return significant_divergence

# Example usage
exchange1 = ccxt.binance()
exchange2 = ccxt.kraken()
detector = CrossExchangePriceDivergenceDetector([exchange1, exchange2], "BTC/USDT")
print(detector.detect_price_divergence())
