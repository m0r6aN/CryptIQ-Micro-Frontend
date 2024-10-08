# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/multi_exchange_price_tracker.py

import ccxt

"""
Multi-Exchange Price Tracker
"""

class MultiExchangePriceTracker:
    def __init__(self, exchanges: list, trading_pair: str):
        self.exchanges = exchanges
        self.trading_pair = trading_pair

    def fetch_prices(self):
        """
        Fetches prices from multiple exchanges and returns a price comparison.
        """
        prices = {}
        for exchange in self.exchanges:
            try:
                ticker = exchange.fetch_ticker(self.trading_pair)
                prices[exchange.name] = ticker['last']
            except Exception as e:
                prices[exchange.name] = f"Error: {e}"

        return prices

    def compare_prices(self):
        """
        Compares prices and detects the best buy and sell options.
        """
        prices = self.fetch_prices()
        sorted_prices = sorted(prices.items(), key=lambda x: x[1] if isinstance(x[1], (int, float)) else float('inf'))

        if len(sorted_prices) >= 2:
            best_buy = sorted_prices[0]
            best_sell = sorted_prices[-1]
            return f"Best Buy: {best_buy[0]} at {best_buy[1]}, Best Sell: {best_sell[0]} at {best_sell[1]}"
        else:
            return "Insufficient data for price comparison."

# Example usage
exchange1 = ccxt.binance()
exchange2 = ccxt.kraken()
tracker = MultiExchangePriceTracker([exchange1, exchange2], "BTC/USDT")
print(tracker.compare_prices())
