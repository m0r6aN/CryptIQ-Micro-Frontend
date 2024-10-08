# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/multi_exchange_order_book_consolidator.py

import ccxt
import pandas as pd

"""
Multi-Exchange Order Book Consolidator
"""

class MultiExchangeOrderBookConsolidator:
    def __init__(self, exchanges: list, trading_pair: str):
        self.exchanges = exchanges
        self.trading_pair = trading_pair

    def fetch_order_books(self):
        """
        Fetch order books from all registered exchanges.
        """
        order_books = {}
        for exchange in self.exchanges:
            try:
                order_books[exchange.name] = exchange.fetch_order_book(self.trading_pair)
            except Exception as e:
                order_books[exchange.name] = f"Error: {e}"
        return order_books

    def consolidate_order_books(self, order_books: dict):
        """
        Consolidate order books from multiple exchanges into a unified view.
        """
        bid_data, ask_data = [], []
        for exchange_name, book in order_books.items():
            if isinstance(book, dict) and len(book['bids']) > 0 and len(book['asks']) > 0:
                bid_data.extend([(exchange_name, bid[0], bid[1]) for bid in book['bids']])
                ask_data.extend([(exchange_name, ask[0], ask[1]) for ask in book['asks']])

        bid_df = pd.DataFrame(bid_data, columns=['Exchange', 'Price', 'Size']).sort_values(by='Price', ascending=False)
        ask_df = pd.DataFrame(ask_data, columns=['Exchange', 'Price', 'Size']).sort_values(by='Price')

        return bid_df, ask_df

# Example usage
exchange1 = ccxt.binance()
exchange2 = ccxt.kraken()
consolidator = MultiExchangeOrderBookConsolidator([exchange1, exchange2], "BTC/USDT")
order_books = consolidator.fetch_order_books()
bid_df, ask_df = consolidator.consolidate_order_books(order_books)
print(bid_df.head())
print(ask_df.head())
