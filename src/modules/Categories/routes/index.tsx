import { lazy, Suspense } from 'react';
import { Loading } from '../../../shared/components/Loading';

const CategoriesView = lazy(() => import('../views').then(module => ({ default: module.Categories })));

export const CategoriesRoute = {
  path: '/dashboard/categories',
  element: (<Suspense fallback={<Loading />}>
    <CategoriesView />
  </Suspense>),
};