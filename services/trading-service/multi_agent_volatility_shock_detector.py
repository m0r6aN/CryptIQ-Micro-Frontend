# File path: CryptIQ-Micro-Frontend/services/trading-service/multi_agent_volatility_shock_detector.py

import pandas as pd

"""
Multi-Agent Volatility Shock Detector
"""

class MultiAgentVolatilityShockDetector:
    def __init__(self):
        self.agents = []

    def register_agent(self, agent_name: str, detect_function):
        """
        Register a new volatility shock detection agent.
        Args:
            agent_name: Name of the agent.
            detect_function: Function implementing the agent's shock detection logic.
        """
        self.agents.append({'agent_name': agent_name, 'detect': detect_function})

    def detect_shocks(self, price_data: pd.DataFrame):
        """
        Detect volatility shocks using registered agents.
        Args:
            price_data: DataFrame containing historical price data.
        """
        shock_results = {}
        for agent in self.agents:
            shock_results[agent['agent_name']] = agent['detect'](price_data)
        return shock_results

# Example usage
def dummy_shock_agent_1(data):
    return f"Agent 1 detected shocks in {data.shape[0]} rows"

def dummy_shock_agent_2(data):
    return f"Agent 2 detected trends in {data.columns}"

detector = MultiAgentVolatilityShockDetector()
detector.register_agent('Dummy Shock Agent 1', dummy_shock_agent_1)
detector.register_agent('Dummy Shock Agent 2', dummy_shock_agent_2)

price_data = pd.DataFrame({'price': [100, 105, 110, 115, 120, 130, 125, 140]})
print("Volatility Shock Results:", detector.detect_shocks(price_data))
