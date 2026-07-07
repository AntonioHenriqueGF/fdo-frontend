import { Button, TextField } from '@mui/material';
import { LoginFormWrapper } from './styles';
import { ApiRequest } from '../../../Services/ApiRequest';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import { useCallback, useState } from 'react';
import { ContentPadSmall } from '../../../shared/components/ContentPad/ContentPadSmall';

export const LoginView: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const handleCsrfSuccess = useCallback((data: {
    email: FormDataEntryValue | null;
    password: FormDataEntryValue | null;
  }) => {
    ApiRequest({
      method: 'POST',
      url: '/api/login',
      data,
      callback: () => {
        navigate('/dashboard'); // Redireciona para o dashboard após login bem-sucedido
        enqueueSnackbar('Login successful', { variant: 'success' });
      },
      errorCallback: () => {
        enqueueSnackbar('Login failed. Please check your credentials and try again.', { variant: 'error' });
      },
    });
  }, [enqueueSnackbar, navigate]);

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
    };
    setLoading(true);
    ApiRequest({
      method: 'GET',
      url: '/sanctum/csrf-cookie',
      callback: () => handleCsrfSuccess(data),
      errorCallback: () => {
        setLoading(false);
        enqueueSnackbar('Auth check failed. Please try again.', { variant: 'error' });
      },
    });
  };
  return (
    <LoginFormWrapper>
      <ContentPadSmall>
        <form action="#" method="post" onSubmit={handleSubmit}>
          <h1 className="text-4xl font-bold">Login</h1>
          <TextField size='small' label="Email" name="email" variant="outlined" fullWidth type="email" autoComplete="email" required />
          <TextField size='small' label="Password" name="password" variant="outlined" fullWidth type="password" autoComplete="current-password" required />
          <Button variant="contained" color="primary" type="submit" fullWidth loading={loading}>
            Enviar
          </Button>
        </form>
      </ContentPadSmall>
    </LoginFormWrapper>
  );
};