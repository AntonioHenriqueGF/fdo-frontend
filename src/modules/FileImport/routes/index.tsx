import { lazy, Suspense } from 'react';
import { Loading } from '../../../shared/components/Loading';

const FileImportView = lazy(() => import('../views').then(module => ({ default: module.FileImportView })));

export const FileImportRoute = {
  path: '/dashboard/statement-import',
  element: (
    <Suspense fallback={<Loading />}>
      <FileImportView />
    </Suspense>
  ),
};