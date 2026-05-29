export interface FDOResponse<T> extends Response {
  data: T;
}

export interface ApiRequestProps<T> {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  options?: RequestInit;
  callback?: (response: FDOResponse<T>) => void;
  errorCallback?: (error: any) => void;
} 

export const ApiRequest = <T>() => {
  const makeRequest = async({ url, method, data, options, callback, errorCallback }: ApiRequestProps<T>) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${url}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
        ...options,
      });
      const responseData = await response.json();
      const fdoResponse: FDOResponse<T> = {
        ...response,
        data: responseData,
      };
      if (callback) {
        callback(fdoResponse);
      }
    } catch(error) {
      console.error('API request error:', error);
      if (errorCallback) {
        errorCallback(error);
      }
    }
  };

  return { makeRequest };
};