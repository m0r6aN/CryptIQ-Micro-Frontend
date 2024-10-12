import React from 'react';
import { useDrag } from 'react-dnd';
import './AgentBox.css';

const AgentBox = ({ agentId, name }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'AGENT',
    item: { agentId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} className="agent-box" style={{ opacity: isDragging ? 0.5 : 1 }}>
      {name}
    </div>
  );
};

export default AgentBox;
