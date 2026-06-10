import type { AxiosResponse } from 'axios';
import api from './api';

export interface ApiRequestProps<T> {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  options?: RequestInit;
  callback: (response: AxiosResponse<T>) => void;
  errorCallback?: (error: any) => void;
} 

export const ApiRequest = <T>({
  url,
  method,
  data,
  callback,
  errorCallback,
}: ApiRequestProps<T>): Promise<void> => {
  return api.request<T>({
    url,
    method,
    data,
  }).then(response => {
    callback(response);
  }).catch(error => {
    errorCallback?.(error);
  });
};