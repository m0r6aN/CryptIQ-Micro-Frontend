# File path: CryptIQ-Micro-Frontend/services/trading-service/smart_order_routing_engine.py

import pandas as pd

class SmartOrderRoutingEngine:
    def __init__(self, fee_structure: dict):
        self.fee_structure = fee_structure

    def route_order(self, order_size: float, exchange_data: pd.DataFrame):
        """
        Route orders to the optimal exchange based on fees and liquidity.
        Args:
            order_size: Size of the order to route.
            exchange_data: DataFrame containing exchange fees and liquidity.
        """
        exchange_data['total_cost'] = exchange_data['fee'] * order_size + (order_size / exchange_data['liquidity'])
        optimal_exchange = exchange_data.loc[exchange_data['total_cost'].idxmin()]
        return optimal_exchange['exchange']

# Example usage
exchange_data = pd.DataFrame({
    'exchange': ['Binance', 'Kraken', 'Coinbase'],
    'fee': [0.1, 0.2, 0.15],
    'liquidity': [5000, 3000, 4000]
})
router = SmartOrderRoutingEngine(fee_structure={'Binance': 0.1, 'Kraken': 0.2, 'Coinbase': 0.15})
print(router.route_order(1000, exchange_data))
