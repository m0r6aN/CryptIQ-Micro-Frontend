import asyncio
import random
import json
from kafka import KafkaConsumer, KafkaProducer
from collections import defaultdict
from services.common.direct_communicator import DirectAgentCommunicator

class IntelligentOrchestrator:
    def __init__(self, kafka_bootstrap_servers):
        # Initialize Kafka Producer and Consumer
        self.kafka_consumer = KafkaConsumer(
            'agent_state',
            bootstrap_servers=kafka_bootstrap_servers,
            value_deserializer=lambda v: json.loads(v.decode('utf-8'))
        )
        self.kafka_producer = KafkaProducer(
            bootstrap_servers=kafka_bootstrap_servers,
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )
        
        # In-Memory Agent Registry
        self.agent_registry = {}
        self.execution_context = defaultdict(dict)
        
        # Initialize Direct Communicator
        self.direct_communicator = DirectAgentCommunicator()

    async def monitor_agent_states(self):
        """Continuously monitor the state of all agents and update the registry."""
        print("Starting to monitor agent states...")
        for message in self.kafka_consumer:
            agent_state = message.value
            agent_id = agent_state["agent_id"]
            self.agent_registry[agent_id] = agent_state
            print(f"Updated state for agent {agent_id}: {agent_state['state']}")

    async def execute_workflow(self, workflow):
        """Execute a workflow with parallel and sequential task management."""
        print("Executing workflow...")
        tasks = workflow.get_all_tasks()
        dependency_graph = self.build_dependency_graph(tasks)
        
        # Execute tasks in parallel based on dependency levels
        for level in sorted(dependency_graph.keys()):
            parallel_tasks = dependency_graph[level]
            await asyncio.gather(*[self.execute_task(task) for task in parallel_tasks])
        
        print("Workflow execution complete!")

    def build_dependency_graph(self, tasks):
        """Build a graph to determine which tasks can run in parallel."""
        dependency_graph = defaultdict(list)
        for task in tasks:
            # Calculate dependency level based on prerequisites
            level = len(task.dependencies)
            dependency_graph[level].append(task)
        return dependency_graph

    async def execute_task(self, task):
        """Execute a task with the best available agent, using direct communication if necessary."""
        best_agent = self.find_best_agent_for_task(task)
        if best_agent:
            if task.require_direct_communication:
                print(f"Executing task {task.task_id} via direct communication with agent {best_agent['agent_id']}")
                await self.direct_communicator.execute_task(self, best_agent['agent_id'], task)
            else:
                # Regular execution via Kafka-based communication
                print(f"Executing task {task.task_id} with agent {best_agent['agent_id']} using service bus")
                await asyncio.sleep(random.uniform(0.5, 2))  # Mock execution time
        else:
            print(f"No suitable agent found for task {task.task_id}")

    def find_best_agent_for_task(self, task):
        """Select an appropriate agent based on task requirements."""
        suitable_agents = [
            agent for agent in self.agent_registry.values()
            if agent['state'] == "idle" and task.requirement in agent['capabilities']
        ]
        return random.choice(suitable_agents) if suitable_agents else None

    def register_agent(self, agent):
        """Register a new intelligent agent with its capabilities."""
        self.agent_registry[agent.agent_id] = {
            "agent_id": agent.agent_id,
            "state": "idle",
            "capabilities": agent.capabilities
        }
        print(f"Agent {agent.agent_id} registered successfully.")

    def report_task_status(self, task_id, status):
        """Send task status updates to Kafka."""
        status_message = {"task_id": task_id, "status": status}
        self.kafka_producer.send('task_status', value=status_message)
        print(f"Reported status for task {task_id}: {status}")
