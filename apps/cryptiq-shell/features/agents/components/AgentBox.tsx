import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import './AgentBox.css';

interface AgentBoxProps {
  agentId: string; // or the appropriate type
  name: string;    // or the appropriate type
}

const AgentBox: React.FC<AgentBoxProps> = ({ agentId, name }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'AGENT',
    item: { agentId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  drag(ref);

  return (
    <div ref={ref} className="agent-box" style={{ opacity: isDragging ? 0.5 : 1 }}>
      {name}
    </div>
  );
};

export default AgentBox;
