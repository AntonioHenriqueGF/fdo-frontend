import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { JobNotificationProvider } from '../JobNotifications/contexts/JobNotificationContext';

interface AuthenticatedUser {
  id?: number;
  use_id?: number;
}

export const AuthGuard: React.FC = () => {
  const [user] = useState<AuthenticatedUser | null>(() => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as AuthenticatedUser;
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [navigate, user]);

  if (!user) {
    return null;
  }

  return (
    <JobNotificationProvider user={user}>
      <Outlet />
    </JobNotificationProvider>
  );
};