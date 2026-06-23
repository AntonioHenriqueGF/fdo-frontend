import { lazy, Suspense } from 'react';
import { Loading } from '../../../shared/components/Loading';

const DashboardPanelView = lazy(() => import('../views/DashboardPanel').then(module => ({ default: module.DashboardPanel })));

export const DashboardPanelRoute = {
  path: '/dashboard/',
  element: (
    <Suspense fallback={<Loading />}>
      <DashboardPanelView />
    </Suspense>
  ),
};