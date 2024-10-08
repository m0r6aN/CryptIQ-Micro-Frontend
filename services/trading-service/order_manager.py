# File path: CryptIQ-Micro-Frontend/services/trading-service/order_manager.py

import ccxt

"""
Order Execution Manager
"""

def execute_order(exchange: ccxt.Exchange, symbol: str, order_type: str, amount: float, price: float = None):
    """
    Executes a market or limit order on the given exchange.
    Args:
        exchange: ccxt Exchange instance.
        symbol: Trading pair symbol (e.g., "BTC/USDT").
        order_type: "market" or "limit".
        amount: Amount to buy/sell.
        price: Price for limit orders (ignored for market orders).
    """
    try:
        if order_type == 'market':
            return exchange.create_market_order(symbol, 'buy', amount)
        elif order_type == 'limit' and price:
            return exchange.create_limit_order(symbol, 'buy', amount, price)
    except Exception as e:
        print(f"Error executing order: {e}")
