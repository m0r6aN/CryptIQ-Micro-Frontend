import React from 'react';
import './TaskConnection.css';

interface Position {
  left: number;
  top: number;
}

interface TaskConnectionProps {
  from: Position;
  to: Position;
}

const TaskConnection: React.FC<TaskConnectionProps> = ({ from, to }) => {
  const style = {
    position: 'absolute',
    left: `${Math.min(from.left, to.left) + 50}px`,
    top: `${Math.min(from.top, to.top) + 25}px`,
    width: `${Math.abs(from.left - to.left)}px`,
    height: `${Math.abs(from.top - to.top)}px`,
    border: '1px solid #007acc',
  } as React.CSSProperties;

  return <div className="task-connection" style={style}></div>;
};

export default TaskConnection;
