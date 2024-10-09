import pandas as pd

class MultiAgentCrossMarketLiquidityStrategyOptimizer:
    def __init__(self):
        self.agents = []

    def register_agent(self, agent_name: str, strategy_function):
        self.agents.append({'agent_name': agent_name, 'optimize_liquidity_strategy': strategy_function})

    def optimize_liquidity_strategy(self, liquidity_data: pd.DataFrame):
        strategy_results = {}
        for agent in self.agents:
            strategy_results[agent['agent_name']] = agent['optimize_liquidity_strategy'](liquidity_data)
        return strategy_results

def dummy_strategy_agent_1(data):
    return f"Agent 1 optimized liquidity strategy for {data.shape[0]} assets"

def dummy_strategy_agent_2(data):
    return f"Agent 2 adjusted liquidity based on columns: {data.columns}"

engine = MultiAgentCrossMarketLiquidityStrategyOptimizer()
engine.register_agent('Dummy Strategy Agent 1', dummy_strategy_agent_1)
engine.register_agent('Dummy Strategy Agent 2', dummy_strategy_agent_2)

liquidity_data = pd.DataFrame({'Asset': ['BTC', 'ETH', 'DOT'], 'Liquidity': [1000000, 500000, 300000]})
print("Cross-Market Liquidity Strategy Optimization Results:", engine.optimize_liquidity_strategy(liquidity_data))
