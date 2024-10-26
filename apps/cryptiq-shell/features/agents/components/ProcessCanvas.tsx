import React, { useState } from 'react';
import { useDrop, XYCoord } from 'react-dnd';
import TaskNode from './TaskNode';
import TaskConnection from './TaskConnection';
import './ProcessCanvas.css';

// Define Task and Agent types
interface Task {
  id: string;
  left: number;
  top: number;
}

interface Agent {
  agentId: string;
}

interface DropItem {
  type: string;
  agentId?: string;
  id?: string;
}

const ProcessCanvas: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [agents, setAgents] = useState<{ [key: string]: string }>({});

  const [, drop] = useDrop(() => ({
    accept: ['TASK', 'AGENT'],
    drop: (item: DropItem, monitor) => {
      const offset = monitor.getClientOffset() as XYCoord;

      if (offset && item.type === 'TASK') {
        const task = { id: item.id || '', left: offset.x, top: offset.y };
        setTasks((prevTasks) => [...prevTasks, task]);
      } else if (offset && item.type === 'AGENT') {
        // Assign agent to the nearest task
        const nearestTask = tasks.reduce((closest: Task | null, task: Task) => {
          const distance = Math.hypot(offset.x - task.left, offset.y - task.top);
          return distance < 100 ? task : closest;
        }, null);

        if (nearestTask) {
          setAgents((prevAgents) => ({ ...prevAgents, [nearestTask.id]: item.agentId! }));
        }
      }
    },
  }));

  return (
    <div ref={drop as unknown as React.LegacyRef<HTMLDivElement>} className="process-canvas">
      {tasks.map((task, index) => (
        <TaskNode key={index} id={task.id} left={task.left} top={task.top} />
      ))}
      {connections.map((conn, index) => (
        <TaskConnection key={index} from={conn.from} to={conn.to} />
      ))}
    </div>
  );
};

export default ProcessCanvas;
