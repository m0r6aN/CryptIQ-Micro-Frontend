import pandas as pd

class MultiAgentDownsideRiskProtectionEngine:
    def __init__(self):
        self.agents = []

    def register_agent(self, agent_name: str, risk_protection_function):
        self.agents.append({'agent_name': agent_name, 'protect_downside_risk': risk_protection_function})

    def protect_downside_risk(self, portfolio_data: pd.DataFrame):
        protection_results = {}
        for agent in self.agents:
            protection_results[agent['agent_name']] = agent['protect_downside_risk'](portfolio_data)
        return protection_results

def dummy_protection_agent_1(data):
    return f"Agent 1 protected against downside risk for {data.shape[0]} assets"

def dummy_protection_agent_2(data):
    return f"Agent 2 assessed protection levels using columns: {data.columns}"

engine = MultiAgentDownsideRiskProtectionEngine()
engine.register_agent('Dummy Protection Agent 1', dummy_protection_agent_1)
engine.register_agent('Dummy Protection Agent 2', dummy_protection_agent_2)

portfolio_data = pd.DataFrame({'Asset': ['BTC', 'ETH', 'BNB'], 'Protection Level': [0.5, 0.7, 0.6]})
print("Downside Risk Protection Results:", engine.protect_downside_risk(portfolio_data))
