import time

class BehaviorAnalyzerAgent:
    def __init__(self):
        self.agent_performance = {}  # Store agent performance metrics (task count, completion time, etc.)

    def record_task_execution(self, agent_name, task_duration):
        """Record the execution time of a task completed by an agent."""
        if agent_name not in self.agent_performance:
            self.agent_performance[agent_name] = {"task_count": 0, "total_time": 0, "avg_time": 0}
        self.agent_performance[agent_name]["task_count"] += 1
        self.agent_performance[agent_name]["total_time"] += task_duration
        self.agent_performance[agent_name]["avg_time"] = self.agent_performance[agent_name]["total_time"] / self.agent_performance[agent_name]["task_count"]

    def suggest_task_reassignment(self, task, current_agent):
        """Suggest a reassignment if the current agent's efficiency is below a threshold."""
        avg_task_time = self.agent_performance.get(current_agent, {}).get("avg_time", float('inf'))
        if avg_task_time > 60:  # Threshold: 60 seconds per task
            print(f"Suggested reassignment for Task {task['id']} from {current_agent} due to low efficiency.")
            return True
        return False

    def monitor_agent_performance(self):
        """Continuously monitor and report agent performance metrics."""
        while True:
            for agent, metrics in self.agent_performance.items():
                print(f"Agent {agent} - Avg Task Time: {metrics['avg_time']}s over {metrics['task_count']} tasks.")
            time.sleep(30)
