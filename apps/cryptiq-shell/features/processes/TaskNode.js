import React from 'react';
import { useDrag } from 'react-dnd';
import './TaskNode.css';

const TaskNode = ({ id, left, top }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="task-node"
      style={{ left, top, opacity: isDragging ? 0.5 : 1 }}
    >
      Task {id}
    </div>
  );
};

export default TaskNode;
