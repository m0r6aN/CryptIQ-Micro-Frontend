import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RealTimeAlerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAgentStatus = async () => {
      try {
        const response = await axios.get('/agent/load');
        const failedAgents = Object.entries(response.data)
          .filter(([agent, load]) => load.status === 'down')
          .map(([agent]) => `Agent ${agent} is down.`);

        setAlerts(failedAgents);
      } catch (error) {
        console.error('Failed to fetch agent status:', error);
      }
    };

    const interval = setInterval(fetchAgentStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="real-time-alerts">
      <h3>Real-Time Alerts</h3>
      {alerts.length > 0 ? (
        <ul>
          {alerts.map((alert, index) => (
            <li key={index} className="alert">{alert}</li>
          ))}
        </ul>
      ) : (
        <p>No active alerts.</p>
      )}
    </div>
  );
};

export default RealTimeAlerts;
