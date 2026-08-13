import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router';
import {
  ApiRequest,
  type StandardApiResponse,
} from '../../Services/ApiRequest';

export const GlobalGuard: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    // Checks only if the path is '/'. For other paths, the verification is handled by AuthGuard and UnauthGuard.
    if (pathname !== '/') {
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
  }, [navigate, pathname]);
  return <Outlet />;
};
