import React from 'react';
import { useAlert } from '../context/AlertContext';
import Alert from './Alert';

const AlertContainer: React.FC = () => {
  const { state } = useAlert();

  return (
    <div className="fixed top-4 right-4 z-50">
      {state.alerts.map((alert) => (
        <Alert key={alert.id} alert={alert} />
      ))}
    </div>
  );
};

export default AlertContainer;