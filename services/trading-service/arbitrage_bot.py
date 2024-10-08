# File path: CryptIQ-Micro-Frontend/services/trading-service/arbitrage_bot.py

import ccxt
import pandas as pd

"""
Cross-Exchange Arbitrage Bot
"""

class CrossExchangeArbitrageBot:
    def __init__(self, exchange1: ccxt.Exchange, exchange2: ccxt.Exchange, symbol: str):
        self.exchange1 = exchange1
        self.exchange2 = exchange2
        self.symbol = symbol

    def fetch_prices(self):
        """
        Fetch bid/ask prices from both exchanges for the specified trading pair.
        """
        order_book1 = self.exchange1.fetch_order_book(self.symbol)
        order_book2 = self.exchange2.fetch_order_book(self.symbol)

        exchange1_ask = order_book1['asks'][0][0] if len(order_book1['asks']) > 0 else None
        exchange2_bid = order_book2['bids'][0][0] if len(order_book2['bids']) > 0 else None

        return exchange1_ask, exchange2_bid

    def detect_arbitrage_opportunity(self):
        """
        Detects if there is a cross-exchange arbitrage opportunity.
        """
        ask, bid = self.fetch_prices()
        if ask and bid and bid > ask:
            return f"Arbitrage Opportunity Detected: Buy on Exchange 1 at {ask}, Sell on Exchange 2 at {bid}"
        else:
            return "No arbitrage opportunity."

    def execute_arbitrage_trade(self, size: float):
        """
        Execute an arbitrage trade if an opportunity exists.
        """
        opportunity = self.detect_arbitrage_opportunity()
        if "Arbitrage Opportunity Detected" in opportunity:
            # Execute Buy on Exchange 1
            self.exchange1.create_market_buy_order(self.symbol, size)
            # Execute Sell on Exchange 2
            self.exchange2.create_market_sell_order(self.symbol, size)
            print(f"Executed Arbitrage Trade: {opportunity}")

# Example usage
exchange1 = ccxt.binance()
exchange2 = ccxt.kraken()
bot = CrossExchangeArbitrageBot(exchange1, exchange2, "BTC/USDT")
bot.execute_arbitrage_trade(0.01)
