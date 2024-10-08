# File path: CryptIQ-Micro-Frontend/services/trading-service/smart_order_routing.py

import ccxt

"""
Smart Order Routing for Best Execution
"""

class SmartOrderRouter:
    def __init__(self, exchanges: list, trading_pair: str):
        self.exchanges = exchanges
        self.trading_pair = trading_pair

    def fetch_all_order_books(self):
        """
        Fetches the order books for the trading pair from all registered exchanges.
        """
        order_books = {}
        for exchange in self.exchanges:
            try:
                order_books[exchange.name] = exchange.fetch_order_book(self.trading_pair)
            except Exception as e:
                order_books[exchange.name] = f"Error fetching order book: {e}"

        return order_books

    def get_best_execution(self, amount: float, action: str):
        """
        Get the best exchange for executing a trade (either buy or sell).
        """
        order_books = self.fetch_all_order_books()
        best_exchange = None
        best_price = float('inf') if action == 'buy' else -float('inf')

        for exchange_name, book in order_books.items():
            if isinstance(book, dict) and len(book['bids']) > 0 and len(book['asks']) > 0:
                if action == 'buy' and book['asks'][0][0] < best_price:
                    best_price = book['asks'][0][0]
                    best_exchange = exchange_name
                elif action == 'sell' and book['bids'][0][0] > best_price:
                    best_price = book['bids'][0][0]
                    best_exchange = exchange_name

        return best_exchange, best_price

# Example usage
exchange1 = ccxt.binance()
exchange2 = ccxt.kraken()
router = SmartOrderRouter([exchange1, exchange2], "BTC/USDT")
print(router.get_best_execution(0.1, "buy"))
