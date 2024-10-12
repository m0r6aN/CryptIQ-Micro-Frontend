import datetime


class PriorityScheduler:
   def __init__(self, agent_monitor):
        self.agent_monitor = agent_monitor

   def calculate_task_priority(self, task, agent_load):
        """Calculate priority score with agent load and deadlines."""
        urgency_score = task.get('urgency', 1) * 3
        value_score = task.get('value', 1) * 2
        complexity_score = (6 - task.get('complexity', 3))

        # Adjust priority for agent load
        preferred_agent = task.get('preferred_agent')
        agent_task_count = agent_load.get(preferred_agent, {}).get('task_count', 0)
        agent_load_penalty = max(0, agent_task_count - 3)

        # Calculate deadline score (higher score if closer to deadline)
        deadline = task.get('deadline')
        if deadline:
            deadline_datetime = datetime.strptime(deadline, "%Y-%m-%d %H:%M:%S")
            time_to_deadline = (deadline_datetime - datetime.now()).total_seconds()
            deadline_score = max(0, 10 - time_to_deadline / 3600)  # Scale: 0-10 based on hours remaining
        else:
            deadline_score = 0

        priority_score = urgency_score + value_score + complexity_score - agent_load_penalty + deadline_score
        return priority_score

   def prioritize_tasks(self, task_queue, agent_load):
        """Prioritize tasks based on adjusted scores with deadlines and agent load impact."""
        prioritized_queue = sorted(task_queue, key=lambda task: self.calculate_task_priority(task, agent_load), reverse=True)
        return prioritized_queue

   def optimize_schedule(self, task_queue):
        """Optimize task order based on real-time agent load and deadlines."""
        agent_load = self.agent_monitor.get_load_data()
        optimized_queue = self.prioritize_tasks(task_queue, agent_load)
        print(f"Optimized Task Queue: {[(task['id'], self.calculate_task_priority(task, agent_load)) for task in optimized_queue]}")
        return optimized_queue

   def get_next_task(self, task_queue):
        """Return the highest-priority task that is ready for execution."""
        prioritized_queue = self.prioritize_tasks(task_queue)
        for task in prioritized_queue:
            if task['status'] == 'pending':
                return task
        return None