import { RouterProvider } from 'react-router';
import { router } from './routes';
import { SnackbarProvider } from 'notistack';

import './styles/fonts.css';
import './styles/global.css';
import { MuiStyleProvider } from './MuiStyleProvider';

function App() {
  return (
    <>
      <MuiStyleProvider>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          autoHideDuration={3000}
        >
          <RouterProvider router={router} />
        </SnackbarProvider>
      </MuiStyleProvider>
    </>
  );
}

export default App;
