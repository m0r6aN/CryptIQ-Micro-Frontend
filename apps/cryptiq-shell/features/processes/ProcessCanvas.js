import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import TaskNode from './TaskNode';
import TaskConnection from './TaskConnection';
import './ProcessCanvas.css';

const ProcessCanvas = () => {
  const [tasks, setTasks] = useState([]);
  const [connections, setConnections] = useState([]);
  const [agents, setAgents] = useState({});

  const [, drop] = useDrop(() => ({
    accept: ['TASK', 'AGENT'],
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      if (item.type === 'TASK') {
        const task = { ...item, left: offset.x, top: offset.y };
        setTasks([...tasks, task]);
      } else if (item.type === 'AGENT') {
        // Assign the agent to the nearest task
        const nearestTask = tasks.reduce((closest, task) => {
          const distance = Math.hypot(offset.x - task.left, offset.y - task.top);
          return distance < 100 ? task : closest;
        }, null);

        if (nearestTask) {
          setAgents({ ...agents, [nearestTask.id]: item.agentId });
        }
      }
    },
  }));

  return (
    <div ref={drop} className="process-canvas">
      {tasks.map((task, index) => (
        <TaskNode key={index} id={task.id} left={task.left} top={task.top} agentId={agents[task.id]} />
      ))}
      {connections.map((conn, index) => (
        <TaskConnection key={index} from={conn.from} to={conn.to} />
      ))}
    </div>
  );
};

export default ProcessCanvas;
