# File path: CryptIQ-Micro-Frontend/services/crypto-data-service/multi_exchange_liquidity_pool_analyzer.py

import pandas as pd
import ccxt

"""
Multi-Exchange Liquidity Pool Analyzer
"""

class MultiExchangeLiquidityPoolAnalyzer:
    def __init__(self, exchanges: list, trading_pair: str):
        self.exchanges = exchanges
        self.trading_pair = trading_pair

    def analyze_liquidity(self):
        """
        Analyze liquidity pools across multiple exchanges for a given trading pair.
        """
        liquidity_data = []
        for exchange in self.exchanges:
            try:
                order_book = exchange.fetch_order_book(self.trading_pair)
                bids = sum([bid[1] for bid in order_book['bids']])
                asks = sum([ask[1] for ask in order_book['asks']])
                liquidity_data.append({'exchange': exchange.name, 'bids': bids, 'asks': asks, 'total_liquidity': bids + asks})
            except Exception as e:
                liquidity_data.append({'exchange': exchange.name, 'error': str(e)})

        return pd.DataFrame(liquidity_data)

# Example usage
exchange1 = ccxt.binance()
exchange2 = ccxt.kraken()
analyzer = MultiExchangeLiquidityPoolAnalyzer([exchange1, exchange2], "BTC/USDT")
print(analyzer.analyze_liquidity())
