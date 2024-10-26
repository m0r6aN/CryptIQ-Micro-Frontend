import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import './styles/dashboard.css';
import ProcessCanvas from './ProcessCanvas';

// No props in this component, so no need for an interface or types.
const App: React.FC = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app-container">
        <h1>Process Designer Dashboard</h1>
        <ProcessCanvas />
      </div>
    </DndProvider>
  );
};

export default App;
