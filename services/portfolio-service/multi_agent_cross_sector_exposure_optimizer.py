import pandas as pd

class MultiAgentCrossSectorExposureOptimizer:
    def __init__(self):
        self.agents = []

    def register_agent(self, agent_name: str, exposure_function):
        self.agents.append({'agent_name': agent_name, 'optimize_exposure': exposure_function})

    def optimize_exposure(self, portfolio_data: pd.DataFrame):
        exposure_results = {}
        for agent in self.agents:
            exposure_results[agent['agent_name']] = agent['optimize_exposure'](portfolio_data)
        return exposure_results

def dummy_exposure_agent_1(data):
    return f"Agent 1 optimized sector exposure for {data.shape[0]} sectors"

def dummy_exposure_agent_2(data):
    return f"Agent 2 adjusted exposure levels using columns: {data.columns}"

engine = MultiAgentCrossSectorExposureOptimizer()
engine.register_agent('Dummy Exposure Agent 1', dummy_exposure_agent_1)
engine.register_agent('Dummy Exposure Agent 2', dummy_exposure_agent_2)

portfolio_data = pd.DataFrame({'Sector': ['DeFi', 'Layer 1', 'Metaverse'], 'Exposure': [0.4, 0.35, 0.25]})
print("Cross-Sector Exposure Optimization Results:", engine.optimize_exposure(portfolio_data))
