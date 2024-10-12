import requests
import threading
import time

class AgentMonitor:
    def __init__(self, agents):
        # Initialize with a list of agent endpoints
        self.agents = agents
        self.agent_load = {agent: {"status": "unknown", "task_count": 0} for agent in agents}
        self.monitor_interval = 10  # Seconds between checks
        self.monitor_thread = None

    def get_agent_status(self, agent_endpoint):
        try:
            response = requests.get(f"{agent_endpoint}/status")
            if response.status_code == 200:
                return response.json()
            else:
                return {"status": "down", "task_count": -1}
        except:
            return {"status": "down", "task_count": -1}

    def monitor_agents(self):
        while True:
            for agent in self.agents:
                status_data = self.get_agent_status(agent)
                self.agent_load[agent] = status_data
            time.sleep(self.monitor_interval)

    def start_monitoring(self):
        if not self.monitor_thread:
            self.monitor_thread = threading.Thread(target=self.monitor_agents)
            self.monitor_thread.start()
    
    def get_load_data(self):
        return self.agent_load
