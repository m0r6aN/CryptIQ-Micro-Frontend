# File path: CryptIQ-Micro-Frontend/services/trading-service/smart_position_manager.py

"""
Smart Position Management System
"""

class SmartPositionManager:
    def __init__(self):
        self.positions = []

    def add_position(self, symbol: str, entry_price: float, stop_loss: float, take_profit: float):
        """
        Add a new position with defined stop-loss and take-profit levels.
        """
        position = {'symbol': symbol, 'entry_price': entry_price, 'stop_loss': stop_loss, 'take_profit': take_profit, 'status': 'open'}
        self.positions.append(position)

    def check_positions(self, current_prices: dict):
        """
        Check each position against current market prices to determine if any should be closed.
        Args:
            current_prices: Dictionary of symbols and their current prices.
        """
        for position in self.positions:
            if position['status'] == 'open':
                current_price = current_prices.get(position['symbol'])
                if current_price is not None:
                    if current_price <= position['stop_loss']:
                        position['status'] = 'stopped_out'
                        print(f"Position stopped out: {position}")
                    elif current_price >= position['take_profit']:
                        position['status'] = 'take_profit_hit'
                        print(f"Position take profit hit: {position}")

# Example usage
manager = SmartPositionManager()
manager.add_position('BTC/USD', 10000, 9500, 10500)
manager.check_positions({'BTC/USD': 9700})
