# File path: CryptIQ-Micro-Frontend/services/portfolio-service/rebalancing.py

def calculate_rebalancing(portfolio, target_allocation):
    """
    Calculates the amount to buy or sell to achieve the target allocation.
    portfolio: dict of {'asset': current_value}
    target_allocation: dict of {'asset': target_percentage}
    """
    total_value = sum(portfolio.values())
    rebalancing_orders = {}

    for asset, current_value in portfolio.items():
        target_value = total_value * target_allocation.get(asset, 0)
        if target_value > current_value:
            rebalancing_orders[asset] = ("buy", target_value - current_value)
        elif target_value < current_value:
            rebalancing_orders[asset] = ("sell", current_value - target_value)

    return rebalancing_orders
