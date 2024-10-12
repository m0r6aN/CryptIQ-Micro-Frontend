import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskPriorityBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [agentLoad, setAgentLoad] = useState({});

  useEffect(() => {
    const fetchTasksAndLoad = async () => {
      const [tasksResponse, loadResponse] = await Promise.all([
        axios.get('/tasks/pending'),
        axios.get('/agent/load')
      ]);
      setTasks(tasksResponse.data);
      setAgentLoad(loadResponse.data);
    };
    fetchTasksAndLoad();
  }, []);

  return (
    <div className="task-priority-board">
      <h2>Task Priority Board</h2>
      <table>
        <thead>
          <tr>
            <th>Task ID</th>
            <th>Urgency</th>
            <th>Value</th>
            <th>Complexity</th>
            <th>Preferred Agent</th>
            <th>Agent Load</th>
            <th>Priority Score</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>{task.urgency}</td>
              <td>{task.value}</td>
              <td>{task.complexity}</td>
              <td>{task.preferred_agent}</td>
              <td>{agentLoad[task.preferred_agent]?.task_count || 'N/A'}</td>
              <td>
                {task.urgency * 3 + task.value * 2 + (6 - task.complexity) - (agentLoad[task.preferred_agent]?.task_count > 3 ? agentLoad[task.preferred_agent].task_count - 3 : 0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskPriorityBoard;
