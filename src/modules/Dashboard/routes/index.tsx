import { lazy, Suspense } from 'react';
import { Loading } from '../../../shared/components/Loading';

const DashboardView = lazy(() => import('../views').then(module => ({ default: module.Dashboard })));

export const DashboardViewComponent: React.FC = () => {
  return (
    <Suspense fallback={<Loading />}>
      <DashboardView />
    </Suspense>
  );
};