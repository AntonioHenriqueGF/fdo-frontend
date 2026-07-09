import { Button, TextField } from '@mui/material';
import { LoginFormWrapper } from './styles';
import { ApiRequest } from '../../../Services/ApiRequest';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import { useCallback, useState } from 'react';
import { ContentPadSmall } from '../../../shared/components/ContentPad/ContentPadSmall';

export const RegisterView: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const handleCsrfSuccess = useCallback((data: {
    name: FormDataEntryValue | null;
    email: FormDataEntryValue | null;
    password: FormDataEntryValue | null;
    password_confirmation: FormDataEntryValue | null;
  }) => {
    ApiRequest({
      method: 'POST',
      url: '/api/signup',
      data,
      callback: () => {
        navigate('/dashboard');
        enqueueSnackbar('Account created successfully', { variant: 'success' });
      },
      errorCallback: () => {
        enqueueSnackbar('Unable to create account. Please review your data and try again.', { variant: 'error' });
      },
      finallyCallback: () => setLoading(false),
    });
  }, [enqueueSnackbar, navigate]);

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      password_confirmation: formData.get('password_confirmation'),
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
          <h1 className="text-4xl font-bold">Create Account</h1>
          <TextField size='small' label="Name" name="name" variant="outlined" fullWidth required />
          <TextField size='small' label="Email" name="email" variant="outlined" fullWidth type="email" autoComplete="email" required />
          <TextField size='small' label="Password" name="password" variant="outlined" fullWidth type="password" autoComplete="new-password" required />
          <TextField
            size='small'
            label="Confirm password"
            name="password_confirmation"
            variant="outlined"
            fullWidth
            type="password"
            autoComplete="new-password"
            required
          />
          <Button variant="contained" color="primary" type="submit" fullWidth loading={loading}>
            Create Account
          </Button>
          <button
            className="mode-switch-link"
            type="button"
            onClick={() => navigate('/login')}
            disabled={loading}
          >
            Already have an account? Log in
          </button>
        </form>
      </ContentPadSmall>
    </LoginFormWrapper>
  );
};
