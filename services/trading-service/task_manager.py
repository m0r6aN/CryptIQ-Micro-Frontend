# File path: CryptIQ-Micro-Frontend/services/trading-service/task_manager.py

import asyncio
from typing import Callable, Dict, List

class TaskManager:
    def __init__(self):
        self.tasks = []

    async def execute_task(self, task_function: Callable, *args, **kwargs):
        """
        Execute a single task asynchronously.
        """
        result = await asyncio.to_thread(task_function, *args, **kwargs)
        return result

    async def run_tasks_in_parallel(self, task_functions: List[Callable], *args, **kwargs):
        """
        Execute multiple tasks in parallel.
        """
        tasks = [self.execute_task(task, *args, **kwargs) for task in task_functions]
        results = await asyncio.gather(*tasks)
        return results

# Example usage:
task_manager = TaskManager()

async def sample_task(param):
    await asyncio.sleep(1)
    return f"Task completed with param: {param}"

# To execute: `await task_manager.run_tasks_in_parallel([sample_task, sample_task], param='test')`
