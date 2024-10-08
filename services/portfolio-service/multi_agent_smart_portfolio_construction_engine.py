# File path: CryptIQ-Micro-Frontend/services/portfolio-service/multi_agent_smart_portfolio_construction_engine.py

import pandas as pd

"""
Multi-Agent Smart Portfolio Construction Engine
"""

class MultiAgentSmartPortfolioConstructionEngine:
    def __init__(self):
        self.agents = []

    def register_agent(self, agent_name: str, construction_function):
        """
        Register a new portfolio construction agent.
        Args:
            agent_name: Name of the construction agent.
            construction_function: Function implementing the agent's construction logic.
        """
        self.agents.append({'agent_name': agent_name, 'construct': construction_function})

    def construct_portfolio(self, asset_data: pd.DataFrame):
        """
        Construct portfolio using registered agents.
        Args:
            asset_data: DataFrame containing asset data.
        """
        construction_results = {}
        for agent in self.agents:
            construction_results[agent['agent_name']] = agent['construct'](asset_data)
        return construction_results

# Example usage
def dummy_construction_agent_1(data):
    return f"Agent 1 constructed portfolio using {data.shape[0]} assets"

def dummy_construction_agent_2(data):
    return f"Agent 2 built portfolio with columns: {data.columns}"

engine = MultiAgentSmartPortfolioConstructionEngine()
engine.register_agent('Dummy Construction Agent 1', dummy_construction_agent_1)
engine.register_agent('Dummy Construction Agent 2', dummy_construction_agent_2)

asset_data = pd.DataFrame({'asset': ['BTC', 'ETH', 'LTC'], 'value': [10000, 5000, 3000]})
print("Portfolio Construction Results:", engine.construct_portfolio(asset_data))
