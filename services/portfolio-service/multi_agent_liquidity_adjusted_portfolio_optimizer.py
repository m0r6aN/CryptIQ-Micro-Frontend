import pandas as pd

class MultiAgentLiquidityAdjustedPortfolioOptimizer:
    def __init__(self):
        self.agents = []

    def register_agent(self, agent_name: str, liquidity_adjustment_function):
        self.agents.append({'agent_name': agent_name, 'adjust_liquidity': liquidity_adjustment_function})

    def optimize_liquidity_adjustment(self, portfolio_data: pd.DataFrame):
        liquidity_adjustment_results = {}
        for agent in self.agents:
            liquidity_adjustment_results[agent['agent_name']] = agent['adjust_liquidity'](portfolio_data)
        return liquidity_adjustment_results

def dummy_liquidity_agent_1(data):
    return f"Agent 1 optimized liquidity adjustment for {data.shape[0]} assets"

def dummy_liquidity_agent_2(data):
    return f"Agent 2 adjusted liquidity levels using columns: {data.columns}"

engine = MultiAgentLiquidityAdjustedPortfolioOptimizer()
engine.register_agent('Dummy Liquidity Agent 1', dummy_liquidity_agent_1)
engine.register_agent('Dummy Liquidity Agent 2', dummy_liquidity_agent_2)

portfolio_data = pd.DataFrame({'Asset': ['BTC', 'ETH', 'ADA'], 'Liquidity': [1000000, 500000, 200000]})
print("Liquidity Adjustment Results:", engine.optimize_liquidity_adjustment(portfolio_data))
