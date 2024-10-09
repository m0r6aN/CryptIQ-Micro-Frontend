import pandas as pd

class MultiAgentMultiFactorRiskAssessmentEngine:
    def __init__(self):
        self.agents = []

    def register_agent(self, agent_name: str, risk_assessment_function):
        self.agents.append({'agent_name': agent_name, 'assess_risk': risk_assessment_function})

    def assess_risk(self, portfolio_data: pd.DataFrame):
        risk_assessment_results = {}
        for agent in self.agents:
            risk_assessment_results[agent['agent_name']] = agent['assess_risk'](portfolio_data)
        return risk_assessment_results

def dummy_risk_assessment_agent_1(data):
    return f"Agent 1 assessed multi-factor risk for {data.shape[0]} assets"

def dummy_risk_assessment_agent_2(data):
    return f"Agent 2 calculated risk metrics using columns: {data.columns}"

engine = MultiAgentMultiFactorRiskAssessmentEngine()
engine.register_agent('Dummy Risk Assessment Agent 1', dummy_risk_assessment_agent_1)
engine.register_agent('Dummy Risk Assessment Agent 2', dummy_risk_assessment_agent_2)

portfolio_data = pd.DataFrame({'Asset': ['BTC', 'ETH', 'SOL'], 'Risk Factor': [0.3, 0.4, 0.5]})
print("Multi-Factor Risk Assessment Results:", engine.assess_risk(portfolio_data))
