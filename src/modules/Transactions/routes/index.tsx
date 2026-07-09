import { lazy, Suspense } from 'react';
import { Loading } from '../../../shared/components/Loading';

const TransactionsView = lazy(() => import('../views').then(module => ({ default: module.TransactionsView })));

export const TransactionsRoute = {
  path: '/dashboard/transactions',
  element: (
    <Suspense fallback={<Loading />}>
      <TransactionsView />
    </Suspense>
  ),
};