# File path: CryptIQ-Micro-Frontend/services/trading-service/cross_exchange_arbitrage_alert.py

import ccxt
import smtplib

"""
Cross-Exchange Arbitrage Alert System
"""

class CrossExchangeArbitrageAlert:
    def __init__(self, exchanges: list, trading_pair: str, email: str, smtp_server: str, smtp_port: int, smtp_user: str, smtp_pass: str):
        self.exchanges = exchanges
        self.trading_pair = trading_pair
        self.email = email
        self.smtp_server = smtp_server
        self.smtp_port = smtp_port
        self.smtp_user = smtp_user
        self.smtp_pass = smtp_pass

    def fetch_prices(self):
        """
        Fetch prices from all specified exchanges.
        """
        prices = {}
        for exchange in self.exchanges:
            try:
                ticker = exchange.fetch_ticker(self.trading_pair)
                prices[exchange.name] = ticker['last']
            except Exception as e:
                print(f"Error fetching price from {exchange.name}: {e}")
        return prices

    def detect_arbitrage_opportunity(self):
        """
        Detect cross-exchange arbitrage opportunities.
        """
        prices = self.fetch_prices()
        if len(prices) < 2:
            return None

        best_buy = min(prices, key=prices.get)
        best_sell = max(prices, key=prices.get)

        if prices[best_sell] > prices[best_buy] * 1.01:  # 1% spread
            return f"Arbitrage Opportunity: Buy on {best_buy} at {prices[best_buy]}, Sell on {best_sell} at {prices[best_sell]}"

        return None

    def send_alert(self, message: str):
        """
        Send an email alert.
        """
        with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
            server.starttls()
            server.login(self.smtp_user, self.smtp_pass)
            server.sendmail(self.smtp_user, self.email, message)

# Example usage
exchange1 = ccxt.binance()
exchange2 = ccxt.kraken()
alert = CrossExchangeArbitrageAlert([exchange1, exchange2], "BTC/USDT")
