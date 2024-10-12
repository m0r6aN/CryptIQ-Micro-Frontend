# File path: CryptIQ-Micro-Frontend/services/ai_assistant/multi_agent_smart_exit_point_generator.py

import pandas as pd

class MultiAgentSmartExitPointGenerator:
    def __init__(self):
        self.agents = []

    def register_agent(self, agent_name: str, exit_function):
        """
        Register a new smart exit point agent.
        Args:
            agent_name: Name of the exit point agent.
            exit_function: Function implementing the agent's exit logic.
        """
        self.agents.append({'agent_name': agent_name, 'generate_exit': exit_function})

    def generate_exit_points(self, market_data: pd.DataFrame):
        """
        Generate exit points dynamically using registered agents.
        Args:
            market_data: DataFrame containing historical market data.
        """
        exit_results = {}
        for agent in self.agents:
            exit_results[agent['agent_name']] = agent['generate_exit'](market_data)
        return exit_results

# Example usage
def dummy_exit_agent_1(data):
    return f"Agent 1 generated exits for {data.shape[0]} rows"

def dummy_exit_agent_2(data):
    return f"Agent 2 identified exit points for columns: {data.columns}"

engine = MultiAgentSmartExitPointGenerator()
engine.register_agent('Dummy Exit Agent 1', dummy_exit_agent_1)
engine.register_agent('Dummy Exit Agent 2', dummy_exit_agent_2)

market_data = pd.DataFrame({'price': [100, 105, 110, 95, 115, 130, 125, 140]})
print("Exit Point Generation Results:", engine.generate_exit_points(market_data))
