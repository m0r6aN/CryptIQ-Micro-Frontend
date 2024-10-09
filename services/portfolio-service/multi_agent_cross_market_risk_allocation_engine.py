import pandas as pd

class MultiAgentCrossMarketRiskAllocationEngine:
    def __init__(self):
        self.agents = []

    def register_agent(self, agent_name: str, allocation_function):
        self.agents.append({'agent_name': agent_name, 'allocate_risk': allocation_function})

    def allocate_risk(self, market_data: pd.DataFrame):
        allocation_results = {}
        for agent in self.agents:
            allocation_results[agent['agent_name']] = agent['allocate_risk'](market_data)
        return allocation_results

def dummy_allocation_agent_1(data):
    return f"Agent 1 allocated risk on {data.shape[0]} markets"

def dummy_allocation_agent_2(data):
    return f"Agent 2 used columns: {data.columns}"

engine = MultiAgentCrossMarketRiskAllocationEngine()
engine.register_agent('Dummy Allocation Agent 1', dummy_allocation_agent_1)
engine.register_agent('Dummy Allocation Agent 2', dummy_allocation_agent_2)

market_data = pd.DataFrame({'BTC_market': [10000, 15000, 20000, 25000], 'ETH_market': [5000, 8000, 12000, 15000]})
print("Cross-Market Risk Allocation Results:", engine.allocate_risk(market_data))
