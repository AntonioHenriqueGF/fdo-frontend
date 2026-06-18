import { lazy, Suspense } from 'react';
import { Loading } from '../../../shared/components/Loading';

const LoginView = lazy(() => import('../views').then(module => ({ default: module.LoginView })));

export const LoginViewComponent: React.FC = () => {
  return (
    <Suspense fallback={<Loading style={{ height: '100vh' }} />}>
      <LoginView />
    </Suspense>
  );
};