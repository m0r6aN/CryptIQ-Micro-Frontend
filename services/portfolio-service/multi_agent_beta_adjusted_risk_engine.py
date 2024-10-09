import pandas as pd

class MultiAgentBetaAdjustedRiskEngine:
    def __init__(self):
        self.agents = []

    def register_agent(self, agent_name: str, risk_adjustment_function):
        self.agents.append({'agent_name': agent_name, 'adjust_beta_risk': risk_adjustment_function})

    def adjust_beta_risk(self, portfolio_data: pd.DataFrame):
        risk_adjustment_results = {}
        for agent in self.agents:
            risk_adjustment_results[agent['agent_name']] = agent['adjust_beta_risk'](portfolio_data)
        return risk_adjustment_results

def dummy_beta_agent_1(data):
    return f"Agent 1 adjusted beta risk for {data.shape[0]} assets"

def dummy_beta_agent_2(data):
    return f"Agent 2 calculated beta-adjusted risk using columns: {data.columns}"

engine = MultiAgentBetaAdjustedRiskEngine()
engine.register_agent('Dummy Beta Agent 1', dummy_beta_agent_1)
engine.register_agent('Dummy Beta Agent 2', dummy_beta_agent_2)

portfolio_data = pd.DataFrame({'Asset': ['BTC', 'ETH', 'LTC'], 'Beta': [1.2, 0.9, 1.5]})
print("Beta Adjusted Risk Results:", engine.adjust_beta_risk(portfolio_data))
