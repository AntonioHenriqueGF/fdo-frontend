import { createBrowserRouter } from 'react-router';
import { FileImportRoute } from '../modules/FileImport/routes';
import { DashboardViewComponent } from '../modules/Dashboard/routes';
import {
  LoginViewComponent,
  RegisterViewComponent,
} from '../modules/Login/routes';
import { GlobalGuard } from '../modules/GlobalGuard';
import { CategoriesRoute } from '../modules/Categories/routes';
import { DashboardPanelRoute } from '../modules/Dashboard/routes/DashboardHomeRoute';
import { AuthGuard } from '../modules/AuthGuard';
import { TransactionsRoute } from '../modules/Transactions/routes';
import { UnauthGuard } from '../modules/UnauthGuard';
import { DailyBalancesRoute } from '../modules/DailyBalances/routes';
import { GlobalErrorBoundary } from '../modules/ErrorBoundaries/GlobalErrorBoudary';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <GlobalGuard />,
    errorElement: <GlobalErrorBoundary />,
    children: [
      {
        path: '/',
        element: <AuthGuard />,
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
