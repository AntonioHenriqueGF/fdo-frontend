import { createBrowserRouter, redirect } from 'react-router';
import { FileImportRoute } from '../modules/FileImport/routes';
import { DashboardViewComponent } from '../modules/Dashboard/routes';
import { LoginViewComponent, RegisterViewComponent } from '../modules/Login/routes';
import { GlobalGuard } from '../modules/GlobalGuard';
import { CategoriesRoute } from '../modules/Categories/routes';
import { DashboardPanelRoute } from '../modules/Dashboard/routes/DashboardHomeRoute';
import { AuthGuard } from '../modules/AuthGuard';
import { TransactionsRoute } from '../modules/Transactions/routes';
import { UnauthGuard } from '../modules/UnauthGuard';
import { DailyBalancesRoute } from '../modules/DailyBalances/routes';
import { ApiRequest } from '../Services/ApiRequest';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <GlobalGuard />,
    children: [
      {
        path: '/dashboard',
        element: <AuthGuard />,
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
        children: [
          {
            path: '/dashboard',
            element: <DashboardViewComponent />,
            children: [
              DashboardPanelRoute,
              FileImportRoute,
              CategoriesRoute,
              TransactionsRoute,
              DailyBalancesRoute,
            ],
          },
        ],
      },
      {
        path: '/',
        element: <UnauthGuard />,
        children: [
          {
            path: '/login',
            element: <LoginViewComponent />,
          },
          {
            path: '/signin',
            element: <RegisterViewComponent />,
          },
        ],
      },
    ],
  },
]);