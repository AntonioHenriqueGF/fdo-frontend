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
import {
  requireAuthLoader,
  requireGuestLoader,
  rootRedirectLoader,
} from './loaders/authLoaders';

export const router = createBrowserRouter([
  {
    path: '/',
    loader: rootRedirectLoader,
    element: <GlobalGuard />,
    errorElement: <GlobalErrorBoundary />,
    children: [
      {
        path: '/dashboard',
        loader: requireAuthLoader,
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
        loader: requireGuestLoader,
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
