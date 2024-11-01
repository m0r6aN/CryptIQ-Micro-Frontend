# services/common/agent_client.py
# The ServiceBusClient is how individual agents connect to and communicate with the orchestrator.

import asyncio
import json
from typing import Callable, Dict, Optional
import logging
from kafka import KafkaProducer, KafkaConsumer
from kafka.errors import KafkaError
from concurrent.futures import ThreadPoolExecutor

class AgentClient:
    def __init__(self, 
                 agent_id: str, 
                 capabilities: list[str],
                 kafka_bootstrap_servers: list[str],
                 direct_comm_port: Optional[int] = None):
        self.agent_id = agent_id
        self.capabilities = capabilities
        self.status = "initializing"
        self.health_metrics = {
            'last_heartbeat': 0,
            'error_count': 0,
            'tasks_completed': 0,
            'avg_response_time': 0
        }
        
        # Kafka setup
        self.producer = KafkaProducer(
            bootstrap_servers=kafka_bootstrap_servers,
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )
        self.consumer = KafkaConsumer(
            f'agent_{agent_id}',
            bootstrap_servers=kafka_bootstrap_servers,
            value_deserializer=lambda v: json.loads(v.decode('utf-8'))
        )
        
        # Handler registry
        self.handlers: Dict[str, Callable] = {}
        self.running = False
        
        # Direct communication setup if needed
        self.direct_comm_port = direct_comm_port
        self.direct_server = None
        if direct_comm_port:
            self._setup_direct_communication()

    async def start(self):
        """Start the agent client"""
        try:
            self.running = True
            await self._register_with_orchestrator()
            
            # Start all necessary loops
            tasks = [
                asyncio.create_task(self._message_loop()),
                asyncio.create_task(self._heartbeat_loop()),
                asyncio.create_task(self._health_monitor_loop())
            ]
            
            if self.direct_comm_port:
                tasks.append(asyncio.create_task(self._direct_comm_loop()))
            
            await asyncio.gather(*tasks)
            
        except Exception as e:
            logging.error(f"Agent startup failed: {e}")
            self.running = False
            raise

    async def _register_with_orchestrator(self):
        """Register agent with the orchestrator"""
        registration_message = {
            "agent_id": self.agent_id,
            "capabilities": self.capabilities,
            "status": self.status,
            "health_metrics": self.health_metrics,
            "direct_comm_port": self.direct_comm_port
        }
        
        try:
            self.producer.send('agent_registration', registration_message)
            self.status = "idle"
            logging.info(f"Agent {self.agent_id} registered successfully")
        except KafkaError as e:
            logging.error(f"Registration failed: {e}")
            raise

    async def _message_loop(self):
        """Main message processing loop"""
        executor = ThreadPoolExecutor(max_workers=1)
        
        while self.running:
            try:
                # Use executor to make Kafka consumer non-blocking
                messages = await asyncio.get_event_loop().run_in_executor(
                    executor, 
                    self.consumer.poll, 
                    1.0  # timeout in seconds
                )
                
                for message in messages.values():
                    for record in message:
                        await self._process_message(record.value)
                        
            except Exception as e:
                logging.error(f"Error in message loop: {e}")
                self.health_metrics['error_count'] += 1

    async def _process_message(self, message: Dict):
        """Process incoming messages"""
        try:
            start_time = asyncio.get_time()
            message_type = message.get('message_type')
            
            if message_type in self.handlers:
                self.status = "processing"
                response = await self.handlers[message_type](message['payload'])
                
                if response:
                    await self._send_response(response, message.get('reply_to'))
                
                # Update metrics
                self.health_metrics['tasks_completed'] += 1
                process_time = asyncio.get_time() - start_time
                self._update_response_time(process_time)
                
            self.status = "idle"
            
        except Exception as e:
            logging.error(f"Message processing error: {e}")
            self.health_metrics['error_count'] += 1
            self._report_error(str(e), message)

    async def _heartbeat_loop(self):
        """Send periodic heartbeats"""
        while self.running:
            try:
                heartbeat = {
                    "agent_id": self.agent_id,
                    "status": self.status,
                    "health_metrics": self.health_metrics,
                    "timestamp": asyncio.get_time()
                }
                self.producer.send('agent_heartbeat', heartbeat)
                self.health_metrics['last_heartbeat'] = asyncio.get_time()
                
            except Exception as e:
                logging.error(f"Heartbeat error: {e}")
                
            await asyncio.sleep(10)  # Heartbeat interval

    async def _health_monitor_loop(self):
        """Monitor agent health metrics"""
        while self.running:
            if self.health_metrics['error_count'] > 5:
                await self._initiate_self_recovery()
            await asyncio.sleep(30)

    async def _initiate_self_recovery(self):
        """Attempt self-recovery when issues are detected"""
        self.status = "recovering"
        try:
            # Reset connections
            self.producer.close()
            self.consumer.close()
            
            # Reinitialize Kafka connections
            self.producer = KafkaProducer(
                bootstrap_servers=self.producer.config['bootstrap_servers'],
                value_serializer=lambda v: json.dumps(v).encode('utf-8')
            )
            self.consumer = KafkaConsumer(
                f'agent_{self.agent_id}',
                bootstrap_servers=self.consumer.config['bootstrap_servers'],
                value_deserializer=lambda v: json.loads(v.decode('utf-8'))
            )
            
            # Reset metrics
            self.health_metrics['error_count'] = 0
            self.status = "idle"
            
        except Exception as e:
            logging.error(f"Recovery failed: {e}")
            self.status = "failed"

    def register_handler(self, message_type: str, handler: Callable):
        """Register a message handler"""
        self.handlers[message_type] = handler
        logging.info(f"Registered handler for {message_type}")

    async def publish_event(self, event_type: str, payload: Dict):
        """Publish an event to the service bus"""
        try:
            message = {
                "agent_id": self.agent_id,
                "event_type": event_type,
                "payload": payload,
                "timestamp": asyncio.get_time()
            }
            self.producer.send(f'events_{event_type}', message)
            
        except Exception as e:
            logging.error(f"Failed to publish event: {e}")
            self.health_metrics['error_count'] += 1

    def _update_response_time(self, new_time: float):
        """Update average response time metric"""
        current_avg = self.health_metrics['avg_response_time']
        completed = self.health_metrics['tasks_completed']
        self.health_metrics['avg_response_time'] = (
            (current_avg * (completed - 1) + new_time) / completed
        )

    async def shutdown(self):
        """Gracefully shutdown the agent"""
        self.running = False
        self.producer.close()
        self.consumer.close()
        if self.direct_server:
            self.direct_server.close()
        logging.info(f"Agent {self.agent_id} shutdown complete")

# Example Usage:
# agent = AgentClient("sentiment_analyzer_1", ["sentiment_analysis", "nlp"], 
#                    ["localhost:9092"], direct_comm_port=8001)
# await agent.start()