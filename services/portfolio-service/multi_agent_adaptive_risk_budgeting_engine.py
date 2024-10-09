import pandas as pd

class MultiAgentAdaptiveRiskBudgetingEngine:
    def __init__(self):
        self.agents = []

    def register_agent(self, agent_name: str, budgeting_function):
        self.agents.append({'agent_name': agent_name, 'assign_risk_budget': budgeting_function})

    def assign_risk_budget(self, portfolio_data: pd.DataFrame):
        budgeting_results = {}
        for agent in self.agents:
            budgeting_results[agent['agent_name']] = agent['assign_risk_budget'](portfolio_data)
        return budgeting_results

def dummy_budgeting_agent_1(data):
    return f"Agent 1 assigned risk budget to {data.shape[0]} assets"

def dummy_budgeting_agent_2(data):
    return f"Agent 2 adapted risk budget using columns: {data.columns}"

engine = MultiAgentAdaptiveRiskBudgetingEngine()
engine.register_agent('Dummy Budgeting Agent 1', dummy_budgeting_agent_1)
engine.register_agent('Dummy Budgeting Agent 2', dummy_budgeting_agent_2)

portfolio_data = pd.DataFrame({'Asset': ['BTC', 'ETH', 'XRP'], 'Value': [15000, 8000, 4000]})
print("Adaptive Risk Budgeting Results:", engine.assign_risk_budget(portfolio_data))
