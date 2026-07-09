import { lazy, Suspense } from 'react';
import { Loading } from '../../../shared/components/Loading';

const LoginView = lazy(() => import('../views').then(module => ({ default: module.LoginView })));
const RegisterView = lazy(() => import('../views/RegisterView').then(module => ({ default: module.RegisterView })));

export const LoginViewComponent: React.FC = () => {
  return (
    <Suspense fallback={<Loading style={{ height: '100vh' }} />}>
      <LoginView />
    </Suspense>
  );
};

export const RegisterViewComponent: React.FC = () => {
  return (
    <Suspense fallback={<Loading style={{ height: '100vh' }} />}>
      <RegisterView />
    </Suspense>
  );
};