import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export const GlobalErrorBoundary: React.FC = () => {
  // Immediately redirects to /login
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/login');
  }, [navigate]);

  return null;
};
