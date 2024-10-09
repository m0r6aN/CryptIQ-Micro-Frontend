import pandas as pd

class MultiAgentAlphaGenerationEngine:
    def __init__(self):
        self.agents = []

    def register_agent(self, agent_name: str, alpha_function):
        self.agents.append({'agent_name': agent_name, 'generate_alpha': alpha_function})

    def generate_alpha(self, market_data: pd.DataFrame):
        alpha_results = {}
        for agent in self.agents:
            alpha_results[agent['agent_name']] = agent['generate_alpha'](market_data)
        return alpha_results

def dummy_alpha_agent_1(data):
    return f"Agent 1 generated alpha for {data.shape[0]} market data points"

def dummy_alpha_agent_2(data):
    return f"Agent 2 used technical indicators on columns: {data.columns}"

engine = MultiAgentAlphaGenerationEngine()
engine.register_agent('Dummy Alpha Agent 1', dummy_alpha_agent_1)
engine.register_agent('Dummy Alpha Agent 2', dummy_alpha_agent_2)

market_data = pd.DataFrame({'BTC_price': [45000, 46000, 47000], 'ETH_price': [3200, 3300, 3400]})
print("Alpha Generation Results:", engine.generate_alpha(market_data))
