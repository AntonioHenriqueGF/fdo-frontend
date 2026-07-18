import { useEffect } from 'react';
import { Outlet } from 'react-router';
import { ApiRequest } from '../../Services/ApiRequest';

export const GlobalGuard: React.FC = () => {
  useEffect(() => {
    ApiRequest({
      url: '/api/erro',
      method: 'GET',
    });
  }, []);

  return <Outlet />;
};
