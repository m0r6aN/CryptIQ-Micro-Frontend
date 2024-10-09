import pandas as pd

class MultiAgentCrossMarketRebalancingEngine:
    def __init__(self):
        self.agents = []

    def register_agent(self, agent_name: str, rebalancing_function):
        self.agents.append({'agent_name': agent_name, 'rebalance_market': rebalancing_function})

    def rebalance_markets(self, market_data: pd.DataFrame):
        rebalancing_results = {}
        for agent in self.agents:
            rebalancing_results[agent['agent_name']] = agent['rebalance_market'](market_data)
        return rebalancing_results

def dummy_rebalancing_agent_1(data):
    return f"Agent 1 rebalanced {data.shape[0]} markets"

def dummy_rebalancing_agent_2(data):
    return f"Agent 2 adjusted rebalancing using columns: {data.columns}"

engine = MultiAgentCrossMarketRebalancingEngine()
engine.register_agent('Dummy Rebalancing Agent 1', dummy_rebalancing_agent_1)
engine.register_agent('Dummy Rebalancing Agent 2', dummy_rebalancing_agent_2)

market_data = pd.DataFrame({'BTC_market': [10000, 15000, 20000, 25000], 'ETH_market': [5000, 8000, 12000, 15000]})
print("Cross-Market Rebalancing Results:", engine.rebalance_markets(market_data))
