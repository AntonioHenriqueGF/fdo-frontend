import { useEffect } from 'react';
import { Outlet } from 'react-router';

export const GlobalGuard: React.FC = () => {
  useEffect(() => {
    // Here you can add any global checks, such as authentication or permissions
    // For example, you could check if the user is authenticated and redirect to login if not
  }, []);
  return <Outlet />;
};