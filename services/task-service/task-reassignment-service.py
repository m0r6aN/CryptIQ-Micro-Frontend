class TaskReassignmentService:
    def __init__(self, agent_monitor, orchestrator):
        self.agent_monitor = agent_monitor
        self.orchestrator = orchestrator

    def detect_failed_agents(self):
        """Detect agents that are down or overloaded and mark their tasks for reassignment."""
        agent_load = self.agent_monitor.get_load_data()
        failed_agents = [agent for agent, data in agent_load.items() if data['status'] == 'down']
        return failed_agents

    def mark_tasks_for_reassignment(self, task_queue, failed_agents):
        """Mark tasks assigned to failed agents for reassignment."""
        for task in task_queue:
            if task['assigned_agent'] in failed_agents:
                task['status'] = 'pending_reassignment'
                print(f"Task {task['id']} marked for reassignment (failed agent: {task['assigned_agent']}).")

    def reassign_pending_tasks(self, task_queue):
        """Reassign tasks that are marked for reassignment."""
        for task in task_queue:
            if task['status'] == 'pending_reassignment':
                new_agent = self.find_least_loaded_agent(task)
                if new_agent:
                    task['assigned_agent'] = new_agent
                    task['status'] = 'assigned'
                    print(f"Task {task['id']} reassigned to {new_agent}.")
                else:
                    print(f"No available agents for Task {task['id']}. It remains in pending_reassignment state.")

    def find_least_loaded_agent(self, task):
        """Find the agent with the least load that can handle the given task."""
        agent_load = self.agent_monitor.get_load_data()
        suitable_agents = {agent: data for agent, data in agent_load.items() if data["status"] == "healthy"}

        if not suitable_agents:
            return None  # No agents are available

        # Sort agents by task count, and pick the least loaded
        least_loaded_agent = min(suitable_agents, key=lambda agent: suitable_agents[agent]["task_count"])
        return least_loaded_agent if suitable_agents[least_loaded_agent]["task_count"] < 5 else None

    def reassign_task(self, task):
        """Reassign a task to the least loaded agent."""
        new_agent = self.find_least_loaded_agent(task)
        if new_agent:
            task['assigned_agent'] = new_agent
            print(f"Task {task['id']} reassigned to {new_agent}.")
        else:
            print(f"No available agents for Task {task['id']}. It remains in the queue.")

    def optimize_task_distribution(self, task_queue):
        """Reassign tasks in the queue for optimal distribution."""
        for task in task_queue:
            if task['status'] == 'pending':
                self.reassign_task(task)
