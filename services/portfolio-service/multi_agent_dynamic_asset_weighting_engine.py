import pandas as pd

class MultiAgentDynamicAssetWeightingEngine:
    def __init__(self):
        self.agents = []

    def register_agent(self, agent_name: str, weighting_function):
        self.agents.append({'agent_name': agent_name, 'assign_weight': weighting_function})

    def assign_weights(self, portfolio_data: pd.DataFrame):
        weighting_results = {}
        for agent in self.agents:
            weighting_results[agent['agent_name']] = agent['assign_weight'](portfolio_data)
        return weighting_results

def dummy_weighting_agent_1(data):
    return f"Agent 1 assigned weights to {data.shape[0]} assets"

def dummy_weighting_agent_2(data):
    return f"Agent 2 calculated dynamic weighting using columns: {data.columns}"

engine = MultiAgentDynamicAssetWeightingEngine()
engine.register_agent('Dummy Weighting Agent 1', dummy_weighting_agent_1)
engine.register_agent('Dummy Weighting Agent 2', dummy_weighting_agent_2)

portfolio_data = pd.DataFrame({'Asset': ['BTC', 'ETH', 'BNB'], 'Value': [10000, 7000, 3000]})
print("Dynamic Asset Weighting Results:", engine.assign_weights(portfolio_data))
