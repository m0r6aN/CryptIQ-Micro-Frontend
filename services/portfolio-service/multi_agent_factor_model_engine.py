import pandas as pd

class MultiAgentFactorModelEngine:
    def __init__(self):
        self.agents = []

    def register_agent(self, agent_name: str, factor_function):
        self.agents.append({'agent_name': agent_name, 'generate_factor_model': factor_function})

    def generate_factor_models(self, market_data: pd.DataFrame):
        factor_results = {}
        for agent in self.agents:
            factor_results[agent['agent_name']] = agent['generate_factor_model'](market_data)
        return factor_results

def dummy_factor_model_agent_1(data):
    return f"Agent 1 generated factor models for {data.shape[0]} data points"

def dummy_factor_model_agent_2(data):
    return f"Agent 2 analyzed factor exposures using columns: {data.columns}"

engine = MultiAgentFactorModelEngine()
engine.register_agent('Dummy Factor Model Agent 1', dummy_factor_model_agent_1)
engine.register_agent('Dummy Factor Model Agent 2', dummy_factor_model_agent_2)

market_data = pd.DataFrame({'BTC_price': [45000, 46000, 47000], 'ETH_price': [3200, 3300, 3400]})
print("Factor Model Generation Results:", engine.generate_factor_models(market_data))
