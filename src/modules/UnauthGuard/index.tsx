import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { ApiRequest, type StandardApiResponse } from '../../Services/ApiRequest';

export const UnauthGuard: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    ApiRequest<StandardApiResponse>({
      method: 'GET',
      url: '/api/me',
      callback: () => {
        navigate('/dashboard', { replace: true });
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Outlet />
  );
};