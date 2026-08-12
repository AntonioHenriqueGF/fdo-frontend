import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import {
  ApiRequest,
  type StandardApiResponse,
} from '../../Services/ApiRequest';

export const GlobalGuard: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Checks only if the path is '/'. For other paths, the verification is handled by AuthGuard and UnauthGuard.
    if (window.location.pathname !== '/') {
      return;
    }
    ApiRequest<StandardApiResponse>({
      method: 'GET',
      url: '/api/me',
      callback: () => {
        navigate('/dashboard', { replace: true });
      },
      errorCallback: () => {
        navigate('/login', { replace: true });
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <Outlet />;
};
