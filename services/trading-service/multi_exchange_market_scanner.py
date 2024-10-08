# File path: CryptIQ-Micro-Frontend/services/trading-service/multi_exchange_market_scanner.py

import ccxt
import pandas as pd

"""
Multi-Exchange Market Scanner
"""

class MultiExchangeMarketScanner:
    def __init__(self, exchanges: list, trading_pair: str):
        self.exchanges = exchanges
        self.trading_pair = trading_pair

    def fetch_prices(self):
        """
        Fetch prices from all specified exchanges for a given trading pair.
        """
        prices = {}
        for exchange in self.exchanges:
            try:
                ticker = exchange.fetch_ticker(self.trading_pair)
                prices[exchange.name] = ticker['last']
            except Exception as e:
                prices[exchange.name] = f"Error: {e}"
        return prices

    def scan_for_arbitrage(self):
        """
        Scan for arbitrage opportunities across multiple exchanges.
        """
        prices = self.fetch_prices()
        if len(prices) < 2:
            return None

        best_buy = min(prices, key=prices.get)
        best_sell = max(prices, key=prices.get)

        if prices[best_sell] > prices[best_buy] * 1.01:  # 1% spread
            return f"Arbitrage Opportunity: Buy on {best_buy} at {prices[best_buy]}, Sell on {best_sell} at {prices[best_sell]}"

        return None

# Example usage
exchange1 = ccxt.binance()
exchange2 = ccxt.kraken()
scanner = MultiExchangeMarketScanner([exchange1, exchange2], "BTC/USDT")
print(scanner.scan_for_arbitrage())
