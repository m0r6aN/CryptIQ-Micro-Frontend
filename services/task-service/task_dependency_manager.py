class TaskDependencyManager:
    def __init__(self):
        self.task_dependencies = {}  # Format: {task_id: [list of dependency task_ids]}
        self.dependency_status = {}  # Track completion: {task_id: 'completed'/'pending'}

    def add_dependency(self, task_id, dependency_id):
        """Add a dependency for a specific task."""
        if task_id not in self.task_dependencies:
            self.task_dependencies[task_id] = []
        self.task_dependencies[task_id].append(dependency_id)
        print(f"Added dependency: Task {task_id} depends on Task {dependency_id}.")

    def are_dependencies_met(self, task_id):
        """Check if all dependencies for a given task are completed."""
        dependencies = self.task_dependencies.get(task_id, [])
        return all(self.dependency_status.get(dep, 'pending') == 'completed' for dep in dependencies)

    def mark_task_completed(self, task_id):
        """Mark a task as completed and update dependencies."""
        self.dependency_status[task_id] = 'completed'
        print(f"Task {task_id} marked as completed.")

    def get_ready_tasks(self, task_queue):
        """Return a list of tasks that are ready to be executed (dependencies met)."""
        ready_tasks = []
        for task in task_queue:
            if task['status'] == 'pending' and self.are_dependencies_met(task['id']):
                ready_tasks.append(task)
        return ready_tasks

    def resolve_dependencies(self, task_queue):
        """Resolve dependencies dynamically as tasks complete."""
        for task in task_queue:
            if self.are_dependencies_met(task['id']) and task['status'] == 'pending':
                print(f"Task {task['id']} is ready to execute. All dependencies met.")
                task['status'] = 'ready'
