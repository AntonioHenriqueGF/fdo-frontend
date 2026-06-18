import { createBrowserRouter, redirect } from 'react-router';
import { FileImportRoute } from '../modules/FileImport/routes';
import { DashboardViewComponent } from '../modules/Dashboard/routes';
import { LoginViewComponent } from '../modules/Login/routes';
import { GlobalGuard } from '../modules/GlobalGuard';
import { ApiRequest } from '../Services/ApiRequest';
import { CategoriesRoute } from '../modules/Categories/routes';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <GlobalGuard />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardViewComponent />,
        children: [
          FileImportRoute,
          CategoriesRoute,
        ],
        loader: async() => {
          return ApiRequest({
            method: 'GET',
            url: '/api/me',
            callback: (response) => {
              console.log('User data loaded:', response.data);
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