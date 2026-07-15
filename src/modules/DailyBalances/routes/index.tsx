import { lazy, Suspense } from 'react';
import { Loading } from '../../../shared/components/Loading';

const DailyBalancesView = lazy(() => import('../views').then(module => ({ default: module.DailyBalancesView })));

export const DailyBalancesRoute = {
  path: '/dashboard/daily-balances',
  element: (
    <Suspense fallback={<Loading />}>
      <DailyBalancesView />
    </Suspense>
  ),
};