import pandas as pd

class MultiAgentFactorExposureManagementEngine:
    def __init__(self):
        self.agents = []

    def register_agent(self, agent_name: str, exposure_function):
        self.agents.append({'agent_name': agent_name, 'manage_factor_exposure': exposure_function})

    def manage_factor_exposure(self, portfolio_data: pd.DataFrame):
        exposure_results = {}
        for agent in self.agents:
            exposure_results[agent['agent_name']] = agent['manage_factor_exposure'](portfolio_data)
        return exposure_results

def dummy_exposure_agent_1(data):
    return f"Agent 1 managed factor exposure for {data.shape[0]} assets"

def dummy_exposure_agent_2(data):
    return f"Agent 2 evaluated factor exposures using columns: {data.columns}"

engine = MultiAgentFactorExposureManagementEngine()
engine.register_agent('Dummy Exposure Agent 1', dummy_exposure_agent_1)
engine.register_agent('Dummy Exposure Agent 2', dummy_exposure_agent_2)

portfolio_data = pd.DataFrame({'Asset': ['BTC', 'ETH', 'SOL'], 'Factor Exposure': [0.2, 0.3, 0.5]})
print("Factor Exposure Management Results:", engine.manage_factor_exposure(portfolio_data))
