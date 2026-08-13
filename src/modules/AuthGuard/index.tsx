import { useEffect } from 'react';
import { Outlet, useLoaderData } from 'react-router';
import { JobNotificationProvider } from '../JobNotifications/contexts/JobNotificationContext';
import type { AuthenticatedUser } from '../../routes/loaders/authLoaders';

export const AuthGuard: React.FC = () => {
  const user = useLoaderData<AuthenticatedUser>();

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return (
    <JobNotificationProvider user={user}>
      <Outlet />
    </JobNotificationProvider>
  );
};
