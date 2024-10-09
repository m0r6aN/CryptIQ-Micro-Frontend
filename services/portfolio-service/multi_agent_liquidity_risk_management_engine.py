import pandas as pd

class MultiAgentLiquidityRiskManagementEngine:
    def __init__(self):
        self.agents = []

    def register_agent(self, agent_name: str, risk_management_function):
        self.agents.append({'agent_name': agent_name, 'manage_liquidity_risk': risk_management_function})

    def manage_liquidity_risk(self, portfolio_data: pd.DataFrame):
        risk_management_results = {}
        for agent in self.agents:
            risk_management_results[agent['agent_name']] = agent['manage_liquidity_risk'](portfolio_data)
        return risk_management_results

def dummy_risk_agent_1(data):
    return f"Agent 1 managed liquidity risk for {data.shape[0]} assets"

def dummy_risk_agent_2(data):
    return f"Agent 2 assessed liquidity risks using columns: {data.columns}"

engine = MultiAgentLiquidityRiskManagementEngine()
engine.register_agent('Dummy Risk Agent 1', dummy_risk_agent_1)
engine.register_agent('Dummy Risk Agent 2', dummy_risk_agent_2)

portfolio_data = pd.DataFrame({'Asset': ['BTC', 'ETH', 'LTC'], 'Value': [20000, 9000, 5000]})
print("Liquidity Risk Management Results:", engine.manage_liquidity_risk(portfolio_data))
