# File path: CryptIQ-Micro-Frontend/services/portfolio-service/multi_agent_risk_sensitivity_analyzer.py

import pandas as pd

"""
Multi-Agent Risk Sensitivity Analyzer
"""

class MultiAgentRiskSensitivityAnalyzer:
    def __init__(self):
        self.agents = []

    def register_agent(self, agent_name: str, sensitivity_function):
        """
        Register a new risk sensitivity agent.
        Args:
            agent_name: Name of the agent.
            sensitivity_function: Function implementing the agent's sensitivity logic.
        """
        self.agents.append({'agent_name': agent_name, 'analyze': sensitivity_function})

    def analyze_sensitivity(self, portfolio: pd.DataFrame):
        """
        Analyze risk sensitivity using registered agents.
        Args:
            portfolio: DataFrame containing portfolio asset data.
        """
        sensitivity_results = {}
        for agent in self.agents:
            sensitivity_results[agent['agent_name']] = agent['analyze'](portfolio)
        return sensitivity_results

# Example usage
def dummy_sensitivity_agent_1(data):
    return f"Agent 1 sensitivity analysis on {data.shape}"

def dummy_sensitivity_agent_2(data):
    return f"Agent 2 sensitivity analysis on {data.columns}"

analyzer = MultiAgentRiskSensitivityAnalyzer()
analyzer.register_agent('Dummy Sensitivity Agent 1', dummy_sensitivity_agent_1)
analyzer.register_agent('Dummy Sensitivity Agent 2', dummy_sensitivity_agent_2)

portfolio = pd.DataFrame({'asset': ['BTC', 'ETH', 'LTC'], 'value': [10000, 5000, 2000]})
print("Risk Sensitivity Results:", analyzer.analyze_sensitivity(portfolio))
