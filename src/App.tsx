import { RouterProvider } from 'react-router';
import { router } from './routes';
import { SnackbarProvider } from 'notistack';

import './styles/fonts.css';

function App() {
  return (
    <>
      <SnackbarProvider maxSnack={3}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        autoHideDuration={3000}
      >
        <RouterProvider router={router} />
      </SnackbarProvider>
    </>
  );
}

export default App;
