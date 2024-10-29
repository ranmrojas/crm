import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Alert, AlertType } from '../types/alert';

interface AlertState {
  alerts: Alert[];
}

type AlertAction =
  | { type: 'ADD_ALERT'; payload: Alert }
  | { type: 'REMOVE_ALERT'; payload: string };

const AlertContext = createContext<{
  state: AlertState;
  addAlert: (type: AlertType, message: string) => void;
  removeAlert: (id: string) => void;
} | undefined>(undefined);

const alertReducer = (state: AlertState, action: AlertAction): AlertState => {
  switch (action.type) {
    case 'ADD_ALERT':
      return { ...state, alerts: [...state.alerts, action.payload] };
    case 'REMOVE_ALERT':
      return {
        ...state,
        alerts: state.alerts.filter((alert) => alert.id !== action.payload),
      };
    default:
      return state;
  }
};

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(alertReducer, { alerts: [] });

  const addAlert = (type: AlertType, message: string) => {
    const id = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    dispatch({ type: 'ADD_ALERT', payload: { id, type, message } });
    setTimeout(() => removeAlert(id), 5000);
  };

  const removeAlert = (id: string) => {
    dispatch({ type: 'REMOVE_ALERT', payload: id });
  };

  return (
    <AlertContext.Provider value={{ state, addAlert, removeAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};