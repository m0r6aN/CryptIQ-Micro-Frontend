import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskControlPanel = () => {
  const [pendingTasks, setPendingTasks] = useState([]);

  useEffect(() => {
    const fetchPendingTasks = async () => {
      const response = await axios.get('/tasks/pending');
      setPendingTasks(response.data);
    };
    fetchPendingTasks();
  }, []);

  const updateTask = async (taskId, newStatus, newAgent) => {
    await axios.post('/tasks/update', { id: taskId, status: newStatus, agent: newAgent });
    const updatedTasks = pendingTasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus, agent: newAgent } : task
    );
    setPendingTasks(updatedTasks);
  };

  return (
    <div className="task-control-panel">
      <h2>Pending Tasks</h2>
      <table>
        <thead>
          <tr>
            <th>Task ID</th>
            <th>Status</th>
            <th>Assigned Agent</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingTasks.map(task => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td>{task.status}</td>
              <td>{task.assigned_agent}</td>
              <td>
                <button onClick={() => updateTask(task.id, 'in_progress', task.assigned_agent)}>Start</button>
                <button onClick={() => updateTask(task.id, 'pending', 'agent2')}>Reassign</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskControlPanel;
