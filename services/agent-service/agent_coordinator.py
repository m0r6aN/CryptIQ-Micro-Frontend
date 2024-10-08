# File path: CryptIQ-Micro-Frontend/services/agent_service/agent_coordinator.py

from typing import List, Dict, Any

class AgentCoordinator:
    def __init__(self):
        self.agents: Dict[str, Any] = {}

    def register_agent(self, name: str, agent_instance):
        """
        Registers a new agent by name.
        """
        self.agents[name] = agent_instance

    def dispatch_task(self, agent_name: str, task: Dict[str, Any]):
        """
        Dispatch a task to a specified agent.
        """
        if agent_name in self.agents:
            agent = self.agents[agent_name]
            return agent.execute_task(task)
        else:
            raise ValueError(f"Agent '{agent_name}' not found!")

# Example agent class
class ExampleAgent:
    def execute_task(self, task: Dict[str, Any]):
        print(f"Executing task: {task}")
        return f"Task '{task['name']}' completed."

# Coordinator example usage
coordinator = AgentCoordinator()
example_agent = ExampleAgent()
coordinator.register_agent('example', example_agent)

# To dispatch: `coordinator.dispatch_task('example', {'name': 'test'})`
