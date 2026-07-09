import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';

interface AuthenticatedUser {
  id?: number;
  use_id?: number;
}

export const GlobalGuard: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      navigate('/login', { replace: true });
      return;
    }

    try {
      JSON.parse(storedUser) as AuthenticatedUser;
    } catch {
      localStorage.removeItem('user');
      navigate('/login', { replace: true });
      return;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <Outlet />;
};