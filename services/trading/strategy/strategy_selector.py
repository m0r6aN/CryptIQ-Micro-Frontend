# File path: CryptIQ-Micro-Frontend/services/trading-service/strategy_selector.py

from typing import Dict, Callable

# Sample strategies
def rsi_strategy(data):
    # Buy when RSI < 30, sell when RSI > 70
    pass

def macd_strategy(data):
    # Buy when MACD crosses above signal, sell when it crosses below
    pass

def bollinger_strategy(data):
    # Buy when price crosses above lower Bollinger Band, sell when it crosses below upper
    pass

# Map market conditions to strategies
strategy_map: Dict[str, Callable] = {
    'bullish': rsi_strategy,
    'bearish': macd_strategy,
    'neutral': bollinger_strategy,
}

def select_strategy(market_condition: str) -> Callable:
    """
    Selects the strategy based on the current market condition.
    """
    return strategy_map.get(market_condition, rsi_strategy)
