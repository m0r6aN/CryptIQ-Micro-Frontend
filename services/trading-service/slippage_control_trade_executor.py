# File path: CryptIQ-Micro-Frontend/services/trading-service/slippage_control_trade_executor.py

import ccxt
import pandas as pd

"""
High-Precision Trade Execution with Slippage Control
"""

class SlippageControlTradeExecutor:
    def __init__(self, exchange: ccxt.Exchange, trading_pair: str, max_slippage_percent: float):
        self.exchange = exchange
        self.trading_pair = trading_pair
        self.max_slippage_percent = max_slippage_percent

    def execute_trade(self, order_type: str, amount: float):
        """
        Execute a trade with slippage control.
        """
        ticker = self.exchange.fetch_ticker(self.trading_pair)
        mid_price = (ticker['bid'] + ticker['ask']) / 2

        if order_type == 'buy':
            target_price = ticker['ask'] * (1 + self.max_slippage_percent / 100)
            order = self.exchange.create_limit_buy_order(self.trading_pair, amount, target_price)
        elif order_type == 'sell':
            target_price = ticker['bid'] * (1 - self.max_slippage_percent / 100)
            order = self.exchange.create_limit_sell_order(self.trading_pair, amount, target_price)
        else:
            raise ValueError("Invalid order type")

        print(f"Executed {order_type} order with slippage control: {order}")

# Example usage
exchange = ccxt.binance()
executor = SlippageControlTradeExecutor(exchange, "BTC/USDT", max_slippage_percent=0.5)
executor.execute_trade('buy', 0.01)
