import pandas as pd

class MultiAgentScenarioAnalysisEngine:
    def __init__(self):
        self.agents = []

    def register_agent(self, agent_name: str, scenario_function):
        self.agents.append({'agent_name': agent_name, 'perform_scenario_analysis': scenario_function})

    def perform_scenario_analysis(self, portfolio_data: pd.DataFrame):
        scenario_results = {}
        for agent in self.agents:
            scenario_results[agent['agent_name']] = agent['perform_scenario_analysis'](portfolio_data)
        return scenario_results

def dummy_scenario_agent_1(data):
    return f"Agent 1 performed scenario analysis on {data.shape[0]} assets"

def dummy_scenario_agent_2(data):
    return f"Agent 2 evaluated scenarios using columns: {data.columns}"

engine = MultiAgentScenarioAnalysisEngine()
engine.register_agent('Dummy Scenario Agent 1', dummy_scenario_agent_1)
engine.register_agent('Dummy Scenario Agent 2', dummy_scenario_agent_2)

portfolio_data = pd.DataFrame({'Asset': ['BTC', 'ETH', 'XRP'], 'Scenario': ['Bull Market', 'Bear Market', 'Sideways']})
print("Scenario Analysis Results:", engine.perform_scenario_analysis(portfolio_data))
