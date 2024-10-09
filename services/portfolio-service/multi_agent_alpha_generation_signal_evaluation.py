import pandas as pd

class MultiAgentAlphaGenerationSignalEvaluation:
    def __init__(self):
        self.agents = []

    def register_agent(self, agent_name: str, alpha_function):
        self.agents.append({'agent_name': agent_name, 'generate_alpha_signal': alpha_function})

    def generate_alpha_signals(self, market_data: pd.DataFrame):
        alpha_signals = {}
        for agent in self.agents:
            alpha_signals[agent['agent_name']] = agent['generate_alpha_signal'](market_data)
        return alpha_signals

def dummy_alpha_signal_agent_1(data):
    return f"Agent 1 generated alpha signals for {data.shape[0]} market data points"

def dummy_alpha_signal_agent_2(data):
    return f"Agent 2 used indicators to generate signals based on columns: {data.columns}"

engine = MultiAgentAlphaGenerationSignalEvaluation()
engine.register_agent('Dummy Alpha Signal Agent 1', dummy_alpha_signal_agent_1)
engine.register_agent('Dummy Alpha Signal Agent 2', dummy_alpha_signal_agent_2)

market_data = pd.DataFrame({'BTC_price': [45000, 46000, 47000], 'ETH_price': [3200, 3300, 3400]})
print("Alpha Signal Generation Results:", engine.generate_alpha_signals(market_data))
