import { lazy, Suspense } from 'react';
import { Loading } from '../../../shared/components/Loading';
import { ApiRequest, type StandardApiResponse } from '../../../Services/ApiRequest';
import type { Category } from '../models/Categories';

const CategoriesView = lazy(() => import('../views').then(module => ({ default: module.Categories })));

export const CategoriesRoute = {
  path: '/dashboard/categories',
  loader: async() => {
    let result = null;

    await ApiRequest<StandardApiResponse<Category[]>>({
      url: '/api/categories',
      method: 'GET',
      callback: (response) => {
        result = response.data;
      },
    });

    return result;
  },
  element: (<Suspense fallback={<Loading />}>
    <CategoriesView />
  </Suspense>),
};