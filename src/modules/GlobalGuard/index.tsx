import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { ApiRequest, type StandardApiResponse } from '../../Services/ApiRequest';

export const GlobalGuard: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    ApiRequest<StandardApiResponse>({
      method: 'GET',
      url: '/api/me',
      callback: (response) => {
        localStorage.setItem('user', JSON.stringify(response.data.data));
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