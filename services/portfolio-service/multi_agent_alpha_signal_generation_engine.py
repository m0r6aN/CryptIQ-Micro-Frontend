import pandas as pd

class MultiAgentAlphaSignalGenerationEngine:
    def __init__(self):
        self.agents = []

    def register_agent(self, agent_name: str, alpha_function):
        self.agents.append({'agent_name': agent_name, 'generate_alpha_signal': alpha_function})

    def generate_alpha_signals(self, portfolio_data: pd.DataFrame):
        alpha_signal_results = {}
        for agent in self.agents:
            alpha_signal_results[agent['agent_name']] = agent['generate_alpha_signal'](portfolio_data)
        return alpha_signal_results

def dummy_alpha_agent_1(data):
    return f"Agent 1 generated alpha signals for {data.shape[0]} assets"

def dummy_alpha_agent_2(data):
    return f"Agent 2 calculated alpha using columns: {data.columns}"

engine = MultiAgentAlphaSignalGenerationEngine()
engine.register_agent('Dummy Alpha Agent 1', dummy_alpha_agent_1)
engine.register_agent('Dummy Alpha Agent 2', dummy_alpha_agent_2)

portfolio_data = pd.DataFrame({'Asset': ['BTC', 'ETH', 'DOT'], 'Alpha Metric': [1.5, 2.0, 1.2]})
print("Alpha Signal Generation Results:", engine.generate_alpha_signals(portfolio_data))
