class TaskGraph:
    def __init__(self):
        self.graph = {}  # Format: {task_id: {"task": task_object, "dependencies": [task_ids]}}

    def add_task(self, task):
        """Add a task to the graph."""
        task_id = task['id']
        if task_id not in self.graph:
            self.graph[task_id] = {"task": task, "dependencies": []}

    def add_dependency(self, task_id, dependency_id):
        """Add a dependency to a task."""
        if task_id in self.graph:
            self.graph[task_id]["dependencies"].append(dependency_id)

    def get_execution_order(self):
        """Get a topological sort of tasks based on dependencies."""
        visited = set()
        stack = []

        def visit(node):
            if node not in visited:
                visited.add(node)
                for dep in self.graph[node]["dependencies"]:
                    visit(dep)
                stack.append(node)

        for task_id in self.graph:
            visit(task_id)

        stack.reverse()  # Reverse the stack to get the correct order
        return stack

    def get_ready_tasks(self):
        """Return tasks that are ready to be executed (all dependencies met)."""
        ready_tasks = []
        for task_id, details in self.graph.items():
            if all(dep in self.graph and self.graph[dep]["task"]["status"] == "completed" for dep in details["dependencies"]):
                ready_tasks.append(details["task"])
        return ready_tasks
