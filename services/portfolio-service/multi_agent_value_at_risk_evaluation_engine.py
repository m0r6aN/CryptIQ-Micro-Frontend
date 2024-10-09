import pandas as pd

class MultiAgentValueAtRiskEvaluationEngine:
    def __init__(self):
        self.agents = []

    def register_agent(self, agent_name: str, var_function):
        self.agents.append({'agent_name': agent_name, 'evaluate_var': var_function})

    def evaluate_var(self, portfolio_data: pd.DataFrame):
        var_results = {}
        for agent in self.agents:
            var_results[agent['agent_name']] = agent['evaluate_var'](portfolio_data)
        return var_results

def dummy_var_agent_1(data):
    return f"Agent 1 evaluated Value at Risk for {data.shape[0]} assets"

def dummy_var_agent_2(data):
    return f"Agent 2 assessed Value at Risk using columns: {data.columns}"

engine = MultiAgentValueAtRiskEvaluationEngine()
engine.register_agent('Dummy VAR Agent 1', dummy_var_agent_1)
engine.register_agent('Dummy VAR Agent 2', dummy_var_agent_2)

portfolio_data = pd.DataFrame({'Asset': ['BTC', 'ETH', 'BNB'], 'Exposure': [0.4, 0.35, 0.25]})
print("Value at Risk Evaluation Results:", engine.evaluate_var(portfolio_data))
