import { createBrowserRouter } from 'react-router';
import { FileImportRoute } from '../modules/FileImport/routes';
import { DashboardViewComponent } from '../modules/Dashboard/routes';

export const router = createBrowserRouter([
  {
    path: '/dashboard',
    element: <DashboardViewComponent />,
    children: [
      FileImportRoute,
    ],
  },
]);