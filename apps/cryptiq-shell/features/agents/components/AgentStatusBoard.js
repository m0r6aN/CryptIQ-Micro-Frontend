import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AgentStatusBoard = () => {
  const [agentLoad, setAgentLoad] = useState({});
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAgentLoad = async () => {
      try {
        const response = await axios.get('/agent/load');
        setAgentLoad(response.data);

        // Check for overloaded agents and push alerts
        const overloadedAgents = Object.entries(response.data)
          .filter(([agent, load]) => load.task_count >= 5)
          .map(([agent]) => `Agent ${agent} is overloaded.`);

        setAlerts(overloadedAgents);
      } catch (error) {
        console.error('Failed to fetch agent load:', error);
      }
    };

    const interval = setInterval(fetchAgentLoad, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="agent-status-board">
      <h2>Agent Load Status</h2>
      <table>
        <thead>
          <tr>
            <th>Agent</th>
            <th>Status</th>
            <th>Task Count</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(agentLoad).map(([agent, load]) => (
            <tr key={agent} className={load.task_count >= 5 ? 'overloaded' : ''}>
              <td>{agent}</td>
              <td>{load.status}</td>
              <td>{load.task_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {alerts.length > 0 && (
        <div className="alerts">
          <h3>Alerts:</h3>
          <ul>
            {alerts.map((alert, index) => (
              <li key={index}>{alert}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AgentStatusBoard;
