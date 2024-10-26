import asyncio

class DirectAgentCommunicator:
    """Handles direct agent-to-agent communication without involving the service bus."""

    def __init__(self):
        self.agent_endpoints = {}  # Registry for storing direct agent addresses

    def register_agent(self, agent_id, agent_address):
        """Register an agent's direct communication endpoint."""
        self.agent_endpoints[agent_id] = agent_address
        print(f"Registered direct communication endpoint for agent {agent_id}.")

    async def send_message(self, from_agent, to_agent_id, message):
        """Send a direct message to a specific agent."""
        if to_agent_id not in self.agent_endpoints:
            print(f"Agent {to_agent_id} is not registered for direct communication.")
            return None
        
        # Simulate direct communication (this would be replaced by actual networking code)
        print(f"Agent {from_agent.agent_id} sending message to Agent {to_agent_id}: {message}")
        
        # Mock async response time
        await asyncio.sleep(0.5)
        response = f"Response from {to_agent_id}: {message} received."
        return response

    async def execute_task(self, requesting_agent, target_agent_id, task):
        """Request another agent to execute a task."""
        if target_agent_id not in self.agent_endpoints:
            print(f"Agent {target_agent_id} is not available for task execution.")
            return None

        print(f"Requesting Agent {target_agent_id} to perform task: {task.task_id}")
        await asyncio.sleep(0.5)
        # Simulated response
        response = f"Agent {target_agent_id} completed task: {task.task_id}"
        return response
