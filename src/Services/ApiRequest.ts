import type { AxiosError, AxiosResponse } from 'axios';
import api from './api';

export interface ApiRequestProps<T> {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  signal?: AbortSignal;
  callback?: (response: AxiosResponse<T>) => void;
  errorCallback?: (error: AxiosError<any>) => void;
  finallyCallback?: () => void;
} 

export interface StandardApiResponse<T> {
  data: T;
  message: string;
  status: 'success' | 'error';
}

export const ApiRequest = <T>({
  url,
  method,
  data,
  signal,
  finallyCallback,
  callback,
  errorCallback,
}: ApiRequestProps<T>): Promise<void> => {
  return api.request<T>({
    url,
    method,
    data,
    signal,
  }).then(response => {
    callback?.(response);
  }).catch(error => {
    errorCallback?.(error);
  }).finally(() => {
    finallyCallback?.();
  });
};