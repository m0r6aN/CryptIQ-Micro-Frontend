# File path: CryptIQ-Micro-Frontend/services/portfolio-service/multi_agent_cross_market_risk_allocation_engine.py

import pandas as pd

"""
Multi-Agent Cross-Market Risk Allocation Engine
"""

class MultiAgentCrossMarketRiskAllocationEngine:
    def __init__(self):
        self.agents = []

    def register_agent(self, agent_name: str, allocation_function):
        """
        Register a new cross-market risk allocation agent.
        Args:
            agent_name: Name of the allocation agent.
            allocation_function: Function implementing the agent's allocation logic.
        """
        self.agents.append({'agent_name': agent_name, 'allocate_risk': allocation_function})

    def allocate_risk(self, market_data: pd.DataFrame):
        """
        Allocate risk across multiple markets using registered agents.
        Args:
            market_data: DataFrame containing market data.
        """
        allocation_results = {}
        for agent in self.agents:
            allocation_results[agent['agent_name']] = agent['allocate_risk'](market_data)
        return allocation_results

# Example usage
def dummy_allocation_agent_1(data):
    return f"Agent 1 allocated risk on {data.shape[0]} markets"

def dummy_allocation_agent_2(data):
    return f"Agent 2 used columns: {data.columns}"

engine = MultiAgentCrossMarketRiskAllocationEngine()
engine.register_agent('Dummy Allocation Agent 1', dummy_allocation_agent_1)
engine.register_agent('Dummy Allocation Agent 2', dummy_allocation_agent_2)

market_data = pd.DataFrame({'BTC_market': [10000, 15000, 20000, 25000], 'ETH_market': [5000, 8000, 12000, 15000]})
print("Cross-Market Risk Allocation Results:", engine.allocate_risk(market_data))
