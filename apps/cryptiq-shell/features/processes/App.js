import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ProcessCanvas from './components/ProcessCanvas';
import './styles/dashboard.css';

const App = () => {
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
