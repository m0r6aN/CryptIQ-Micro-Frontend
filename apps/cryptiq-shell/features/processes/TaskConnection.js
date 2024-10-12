import React from 'react';
import './TaskConnection.css';

const TaskConnection = ({ from, to }) => {
  const style = {
    position: 'absolute',
    left: `${Math.min(from.left, to.left) + 50}px`,
    top: `${Math.min(from.top, to.top) + 25}px`,
    width: `${Math.abs(from.left - to.left)}px`,
    height: `${Math.abs(from.top - to.top)}px`,
    border: '1px solid #007acc',
  };

  return <div className="task-connection" style={style}></div>;
};

export default TaskConnection;
