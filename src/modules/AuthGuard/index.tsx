import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { JobNotificationProvider } from '../JobNotifications/contexts/JobNotificationContext';
import {
  ApiRequest,
  type StandardApiResponse,
} from '../../Services/ApiRequest';

interface AuthenticatedUser {
  id?: number;
  use_id?: number;
}

export const AuthGuard: React.FC = () => {
  const [user, setUser] = useState<AuthenticatedUser | null>();
  const navigate = useNavigate();
  useEffect(() => {
    ApiRequest<StandardApiResponse>({
      method: 'GET',
      url: '/api/me',
      callback: (response) => {
        const userData = response.data.data;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      },
      errorCallback: () => {
        navigate('/login', { replace: true });
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user) {
    return null;
  }

  return (
    <JobNotificationProvider user={user}>
      <Outlet />
    </JobNotificationProvider>
  );
};
