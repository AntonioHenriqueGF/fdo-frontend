import { createBrowserRouter, redirect } from 'react-router';
import { FileImportRoute } from '../modules/FileImport/routes';
import { DashboardViewComponent } from '../modules/Dashboard/routes';
import { LoginViewComponent } from '../modules/Login/routes';
import { GlobalGuard } from '../modules/GlobalGuard';
import { ApiRequest, type StandardApiResponse } from '../Services/ApiRequest';
import { CategoriesRoute } from '../modules/Categories/routes';
import { DashboardPanelRoute } from '../modules/Dashboard/routes/DashboardHomeRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <GlobalGuard />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardViewComponent />,
        children: [
          DashboardPanelRoute,
          FileImportRoute,
          CategoriesRoute,
        ],
        loader: async() => {
          return ApiRequest<StandardApiResponse>({
            method: 'GET',
            url: '/api/me',
            callback: (response) => {
              localStorage.setItem('user', JSON.stringify(response.data.data));
            },
            errorCallback: () => {
              console.log('User not authenticated, redirecting to login');
              throw redirect('/login');
            },
          });
        },
      },
      {
        path: '/login',
        element: <LoginViewComponent />,
      },
    ],
  },
]);