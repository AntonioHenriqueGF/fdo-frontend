import { useContext } from 'react';
import { JobNotificationContext } from '../contexts/JobNotificationContext';

export const useJobNotifications = () => {
  const context = useContext(JobNotificationContext);

  if (!context) {
    throw new Error('useJobNotifications must be used within a JobNotificationProvider');
  }

  return context;
};
