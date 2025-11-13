import { useAuth } from '@clerk/clerk-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' }, token);
  }

  async post<T>(endpoint: string, data: any, token?: string): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      token
    );
  }

  async patch<T>(endpoint: string, data: any, token?: string): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      },
      token
    );
  }

  async delete<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' }, token);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

export const useApiClient = () => {
  const { getToken } = useAuth();

  const authenticatedRequest = async <T>(
    method: 'get' | 'post' | 'patch' | 'delete',
    endpoint: string,
    data?: any
  ): Promise<T> => {
    const token = await getToken();
    
    switch (method) {
      case 'get':
        return apiClient.get<T>(endpoint, token || undefined);
      case 'post':
        return apiClient.post<T>(endpoint, data, token || undefined);
      case 'patch':
        return apiClient.patch<T>(endpoint, data, token || undefined);
      case 'delete':
        return apiClient.delete<T>(endpoint, token || undefined);
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  };

  return {
    get: <T>(endpoint: string) => authenticatedRequest<T>('get', endpoint),
    post: <T>(endpoint: string, data: any) => authenticatedRequest<T>('post', endpoint, data),
    patch: <T>(endpoint: string, data: any) => authenticatedRequest<T>('patch', endpoint, data),
    delete: <T>(endpoint: string) => authenticatedRequest<T>('delete', endpoint),
  };
};