import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import './TaskNode.css';

interface TaskNodeProps {
  id: string; // or number, depending on your use case
  left: number;
  top: number;
}

const TaskNode = ({ id, left, top }: TaskNodeProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  drag(ref);

  return (
    <div
      ref={ref}
      className="task-node"
      style={{ left, top, opacity: isDragging ? 0.5 : 1 }}
    >
      Task {id}
    </div>
  );
};

export default TaskNode;
