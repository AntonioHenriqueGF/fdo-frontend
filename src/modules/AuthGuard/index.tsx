import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { echo } from '../../Services/echo';

export const AuthGuard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login', { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    if (!user) return;

    const channel = echo.private(`App.Models.User.${user.use_id}`);

    channel.listen('.job-request.updated', (event: string) => {
      console.log(event);
    });

    return () => {
      echo.leave(`private-App.Models.User.${user.use_id}`);
    };
  }, [user]);
  return user && <Outlet />;
};