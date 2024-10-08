# File path: CryptIQ-Micro-Frontend/services/portfolio-service/dynamic_multi_agent_asset_allocation_engine.py

import pandas as pd

"""
Dynamic Multi-Agent Asset Allocation Engine
"""

class DynamicMultiAgentAssetAllocationEngine:
    def __init__(self):
        self.agents = []

    def register_agent(self, agent_name: str, allocation_function):
        """
        Register a new asset allocation agent.
        Args:
            agent_name: Name of the allocation agent.
            allocation_function: Function implementing the agent's allocation logic.
        """
        self.agents.append({'agent_name': agent_name, 'allocate': allocation_function})

    def allocate_assets(self, portfolio: pd.DataFrame):
        """
        Allocate assets dynamically using registered agents.
        Args:
            portfolio: DataFrame containing portfolio asset data.
        """
        allocation_results = {}
        for agent in self.agents:
            allocation_results[agent['agent_name']] = agent['allocate'](portfolio)
        return allocation_results

# Example usage
def dummy_allocation_agent_1(data):
    return f"Agent 1 allocated assets on {data.shape[0]} rows"

def dummy_allocation_agent_2(data):
    return f"Agent 2 allocated assets based on columns: {data.columns}"

engine = DynamicMultiAgentAssetAllocationEngine()
engine.register_agent('Dummy Allocation Agent 1', dummy_allocation_agent_1)
engine.register_agent('Dummy Allocation Agent 2', dummy_allocation_agent_2)

portfolio = pd.DataFrame({'asset': ['BTC', 'ETH', 'LTC'], 'value': [10000, 5000, 3000]})
print("Asset Allocation Results:", engine.allocate_assets(portfolio))
