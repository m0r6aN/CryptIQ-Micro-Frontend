import asyncio
import json
from typing import Dict, List
from kafka import KafkaConsumer, KafkaProducer
from collections import defaultdict
from services.common.direct_communicator import DirectAgentCommunicator
from pydantic import BaseModel

class AgentMessage(BaseModel):
    agent_id: str
    message_type: str
    payload: Dict
    priority: int = 1
    timestamp: float
    require_direct_comm: bool = False

class IntelligentOrchestrator:
    def __init__(self, kafka_bootstrap_servers):
        # Kafka Setup
        self.kafka_consumer = KafkaConsumer(
            'agent_state', 'agent_heartbeat',
            bootstrap_servers=kafka_bootstrap_servers,
            value_deserializer=lambda v: json.loads(v.decode('utf-8'))
        )
        self.kafka_producer = KafkaProducer(
            bootstrap_servers=kafka_bootstrap_servers,
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )
        
        # Agent Management
        self.agent_registry = {}
        self.execution_context = defaultdict(dict)
        self.active_workflows = {}
        
        # Communication Handlers
        self.direct_communicator = DirectAgentCommunicator()
        self.message_queue = asyncio.Queue()

    async def start(self):
        """Start all orchestrator services"""
        await asyncio.gather(
            self.monitor_agent_states(),
            self.monitor_agent_health(),
            self.process_message_queue()
        )

    async def monitor_agent_states(self):
        """Enhanced state monitoring with health checks"""
        async for message in self.kafka_consumer:
            topic = message.topic
            data = message.value
            
            if topic == 'agent_state':
                await self._update_agent_state(data)
            elif topic == 'agent_heartbeat':
                await self._process_heartbeat(data)

    async def monitor_agent_health(self):
        """Monitor agent health and handle failures"""
        while True:
            current_time = asyncio.get_time()
            failed_agents = []
            
            for agent_id, info in self.agent_registry.items():
                if current_time - info['last_heartbeat'] > 30:
                    failed_agents.append(agent_id)
                    await self._handle_agent_failure(agent_id)
            
            # Redistribute work from failed agents
            if failed_agents:
                await self._redistribute_workload(failed_agents)
            
            await asyncio.sleep(5)

    async def execute_workflow(self, workflow):
        """Execute workflow with enhanced monitoring and recovery"""
        workflow_id = workflow.workflow_id
        self.active_workflows[workflow_id] = {
            'status': 'running',
            'tasks': workflow.get_all_tasks(),
            'dependencies': self.build_dependency_graph(workflow.get_all_tasks())
        }

        try:
            for level in sorted(self.active_workflows[workflow_id]['dependencies'].keys()):
                parallel_tasks = self.active_workflows[workflow_id]['dependencies'][level]
                results = await asyncio.gather(
                    *[self.execute_task(task, workflow_id) for task in parallel_tasks],
                    return_exceptions=True
                )
                
                # Handle any failed tasks
                for task, result in zip(parallel_tasks, results):
                    if isinstance(result, Exception):
                        await self._handle_task_failure(task, workflow_id)

            self.active_workflows[workflow_id]['status'] = 'completed'
            
        except Exception as e:
            self.active_workflows[workflow_id]['status'] = 'failed'
            await self._handle_workflow_failure(workflow_id, str(e))

    async def execute_task(self, task, workflow_id):
        """Enhanced task execution with fallback and monitoring"""
        best_agent = await self._select_optimal_agent(task)
        retries = 3
        
        while retries > 0:
            try:
                if task.require_direct_communication:
                    result = await self.direct_communicator.execute_task(
                        self, best_agent['agent_id'], task
                    )
                else:
                    result = await self._execute_via_service_bus(best_agent['agent_id'], task)
                
                await self._report_task_completion(task, workflow_id, result)
                return result
                
            except Exception as e:
                retries -= 1
                if retries == 0:
                    raise
                best_agent = await self._select_optimal_agent(task, exclude=[best_agent['agent_id']])

    async def _select_optimal_agent(self, task, exclude=[]):
        """Select the best agent based on multiple criteria"""
        candidates = []
        for agent_id, info in self.agent_registry.items():
            if agent_id in exclude:
                continue
            
            if (info['state'] == 'idle' and 
                task.requirement in info['capabilities'] and
                info['health_score'] > 0.7):
                
                score = self._calculate_agent_score(info, task)
                candidates.append((agent_id, score))
        
        if not candidates:
            raise NoSuitableAgentError(f"No suitable agent for task {task.task_id}")
            
        return self.agent_registry[max(candidates, key=lambda x: x[1])[0]]

    def _calculate_agent_score(self, agent_info, task):
        """Calculate agent suitability score"""
        return (
            agent_info['health_score'] * 0.4 +
            agent_info['performance_score'] * 0.3 +
            agent_info['reliability_score'] * 0.3
        )

    async def _handle_agent_failure(self, agent_id):
        """Handle agent failure with recovery attempts"""
        self.agent_registry[agent_id]['state'] = 'recovery'
        
        # Attempt recovery
        try:
            await self.direct_communicator.restart_agent(agent_id)
            await self._verify_agent_health(agent_id)
        except Exception as e:
            await self._mark_agent_dead(agent_id)

    async def _redistribute_workload(self, failed_agents):
        """Redistribute tasks from failed agents"""
        for workflow_id, workflow in self.active_workflows.items():
            if workflow['status'] != 'running':
                continue
                
            affected_tasks = [
                task for task in workflow['tasks']
                if task.assigned_agent in failed_agents
            ]
            
            for task in affected_tasks:
                await self.execute_task(task, workflow_id)

    async def process_message_queue(self):
        """Process queued messages with priority handling"""
        while True:
            message = await self.message_queue.get()
            try:
                if message.require_direct_comm:
                    await self.direct_communicator.send_message(message)
                else:
                    self.kafka_producer.send(
                        f'agent_{message.agent_id}',
                        value=message.dict()
                    )
            except Exception as e:
                await self._handle_message_failure(message, str(e))

# Usage Example:
# orchestrator = EnhancedOrchestrator(kafka_bootstrap_servers=['localhost:9092'])
# await orchestrator.start()