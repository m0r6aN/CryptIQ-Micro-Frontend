# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/cross_exchange_liquidity_monitor.py

import ccxt
import pandas as pd

"""
Cross-Exchange Liquidity Pool Monitor
"""

class CrossExchangeLiquidityMonitor:
    def __init__(self, exchanges: list, trading_pair: str):
        self.exchanges = exchanges
        self.trading_pair = trading_pair

    def fetch_liquidity(self):
        """
        Fetch liquidity (bid/ask depth) for each exchange and compile into a DataFrame.
        """
        liquidity_data = []
        for exchange in self.exchanges:
            try:
                order_book = exchange.fetch_order_book(self.trading_pair)
                bid_depth = sum([order[1] for order in order_book['bids']])
                ask_depth = sum([order[1] for order in order_book['asks']])
                liquidity_data.append({'exchange': exchange.name, 'bid_depth': bid_depth, 'ask_depth': ask_depth})
            except Exception as e:
                liquidity_data.append({'exchange': exchange.name, 'bid_depth': None, 'ask_depth': None})

        return pd.DataFrame(liquidity_data)

# Example usage
exchange1 = ccxt.binance()
exchange2 = ccxt.kraken()
monitor = CrossExchangeLiquidityMonitor([exchange1, exchange2], "BTC/USDT")
print(monitor.fetch_liquidity())
