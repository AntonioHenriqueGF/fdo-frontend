import { redirect, type LoaderFunctionArgs } from 'react-router';
import api from '../../Services/api';
import type { StandardApiResponse } from '../../Services/ApiRequest';

export interface AuthenticatedUser {
  id?: number;
  use_id?: number;
}

const fetchCurrentUser = async (): Promise<AuthenticatedUser | null> => {
  try {
    const response =
      await api.get<StandardApiResponse<AuthenticatedUser>>('/api/me');
    return response.data.data ?? null;
  } catch {
    return null;
  }
};

export const rootRedirectLoader = async ({ request }: LoaderFunctionArgs) => {
  const { pathname } = new URL(request.url);

  if (pathname !== '/') {
    return null;
  }

  const user = await fetchCurrentUser();

  if (user) {
    throw redirect('/dashboard');
  }

  throw redirect('/login');
};

export const requireAuthLoader = async () => {
  const user = await fetchCurrentUser();

  if (!user) {
    throw redirect('/login');
  }

  return user;
};

export const requireGuestLoader = async () => {
  const user = await fetchCurrentUser();

  if (user) {
    throw redirect('/dashboard');
  }

  return null;
};
