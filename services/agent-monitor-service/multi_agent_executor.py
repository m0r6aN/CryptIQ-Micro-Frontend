# File path: CryptIQ-Micro-Frontend/services/agent_service/multi_agent_executor.py

from typing import List, Dict, Callable
import asyncio

"""
Multi-Agent Execution Engine
"""

class MultiAgentExecutor:
    def __init__(self):
        self.agents: Dict[str, Callable] = {}

    def register_agent(self, name: str, agent_function: Callable):
        """
        Register a new agent with a specified function.
        """
        self.agents[name] = agent_function

    async def execute_agents_in_sequence(self, agent_names: List[str], *args, **kwargs):
        """
        Execute agents sequentially based on the order provided.
        """
        results = []
        for agent_name in agent_names:
            if agent_name in self.agents:
                result = await asyncio.to_thread(self.agents[agent_name], *args, **kwargs)
                results.append(result)
        return results

    async def execute_agents_in_parallel(self, agent_names: List[str], *args, **kwargs):
        """
        Execute agents in parallel and gather results.
        """
        tasks = [self.agents[agent_name](*args, **kwargs) for agent_name in agent_names if agent_name in self.agents]
        results = await asyncio.gather(*tasks)
        return results

# Example usage
executor = MultiAgentExecutor()
executor.register_agent('risk_analysis', lambda data: f"Risk analysis completed for {data}.")
executor.register_agent('market_scan', lambda data: f"Market scan completed for {data}.")

# To execute sequentially: `await executor.execute_agents_in_sequence(['risk_analysis', 'market_scan'], 'BTC/USD')`
