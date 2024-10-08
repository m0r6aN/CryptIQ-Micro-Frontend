# File path: CryptIQ-Micro-Frontend/services/ai_assistant/multi_agent_orchestrator.py

class MultiAgentOrchestrator:
    def __init__(self, agents: dict):
        self.agents = agents

    def execute_workflow(self, workflow: list):
        """
        Execute a multi-agent workflow based on the defined sequence.
        Args:
            workflow: A list of tuples representing the workflow steps (agent_name, task_name, params).
        """
        results = {}
        for agent_name, task_name, params in workflow:
            agent = self.agents.get(agent_name)
            if agent:
                result = agent.execute_task(task_name, **params)
                results[f"{agent_name}_{task_name}"] = result
        return results

# Example usage
class ExampleAgent:
    def execute_task(self, task_name, **params):
        return f"Executed {task_name} with {params}"

agents = {'DataAgent': ExampleAgent(), 'TradingAgent': ExampleAgent()}
orchestrator = MultiAgentOrchestrator(agents)
workflow = [('DataAgent', 'fetch_data', {'symbol': 'BTC/USD'}), ('TradingAgent', 'execute_trade', {'action': 'buy'})]
print(orchestrator.execute_workflow(workflow))
