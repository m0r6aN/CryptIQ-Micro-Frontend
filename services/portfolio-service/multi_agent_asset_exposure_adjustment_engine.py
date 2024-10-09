import pandas as pd

class MultiAgentAssetExposureAdjustmentEngine:
    def __init__(self):
        self.agents = []

    def register_agent(self, agent_name: str, exposure_adjustment_function):
        self.agents.append({'agent_name': agent_name, 'adjust_exposure': exposure_adjustment_function})

    def adjust_exposure(self, portfolio_data: pd.DataFrame):
        exposure_adjustment_results = {}
        for agent in self.agents:
            exposure_adjustment_results[agent['agent_name']] = agent['adjust_exposure'](portfolio_data)
        return exposure_adjustment_results

def dummy_exposure_agent_1(data):
    return f"Agent 1 adjusted exposure for {data.shape[0]} assets"

def dummy_exposure_agent_2(data):
    return f"Agent 2 adjusted exposure using columns: {data.columns}"

engine = MultiAgentAssetExposureAdjustmentEngine()
engine.register_agent('Dummy Exposure Agent 1', dummy_exposure_agent_1)
engine.register_agent('Dummy Exposure Agent 2', dummy_exposure_agent_2)

portfolio_data = pd.DataFrame({'Asset': ['BTC', 'ETH', 'SOL'], 'Exposure': [0.3, 0.4, 0.3]})
print("Exposure Adjustment Results:", engine.adjust_exposure(portfolio_data))
