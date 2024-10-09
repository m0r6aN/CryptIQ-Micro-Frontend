import pandas as pd

class MultiAgentPortfolioStressTestingEngine:
    def __init__(self):
        self.agents = []

    def register_agent(self, agent_name: str, stress_testing_function):
        self.agents.append({'agent_name': agent_name, 'stress_test_portfolio': stress_testing_function})

    def stress_test_portfolio(self, portfolio_data: pd.DataFrame):
        stress_test_results = {}
        for agent in self.agents:
            stress_test_results[agent['agent_name']] = agent['stress_test_portfolio'](portfolio_data)
        return stress_test_results

def dummy_stress_test_agent_1(data):
    return f"Agent 1 performed stress testing on {data.shape[0]} assets under extreme market conditions"

def dummy_stress_test_agent_2(data):
    return f"Agent 2 evaluated stress testing metrics using columns: {data.columns}"

engine = MultiAgentPortfolioStressTestingEngine()
engine.register_agent('Dummy Stress Test Agent 1', dummy_stress_test_agent_1)
engine.register_agent('Dummy Stress Test Agent 2', dummy_stress_test_agent_2)

portfolio_data = pd.DataFrame({'Asset': ['BTC', 'ETH', 'DOT'], 'Value': [12000, 7000, 3000]})
print("Portfolio Stress Testing Results:", engine.stress_test_portfolio(portfolio_data))
