import { useAuth } from '@clerk/clerk-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiClient {
    private baseURL: string;
    private getToken?: () => Promise<string | null>;
    private isInitialized = false;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    setAuthTokenGetter(getter: () => Promise<string | null>) {
        this.getToken = getter;
        this.isInitialized = true;
    }

    isReady() {
        return this.isInitialized;
    }

    private async getHeaders(): Promise<HeadersInit> {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (this.getToken) {
            // Get token without template - Clerk will use default JWT
            const token = await this.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            } else {
                console.warn('No token available from Clerk');
            }
        }

        return headers;
    }

    async get<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'GET',
            headers: await this.getHeaders(),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return response.json();
    }

    async post<T>(endpoint: string, data?: any): Promise<T> {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'POST',
            headers: await this.getHeaders(),
            body: data ? JSON.stringify(data) : undefined,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return response.json();
    }

    async patch<T>(endpoint: string, data?: any): Promise<T> {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'PATCH',
            headers: await this.getHeaders(),
            body: data ? JSON.stringify(data) : undefined,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return response.json();
    }

    async put<T>(endpoint: string, data?: any): Promise<T> {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'PUT',
            headers: await this.getHeaders(),
            body: data ? JSON.stringify(data) : undefined,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return response.json();
    }

    async delete<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            method: 'DELETE',
            headers: await this.getHeaders(),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return response.json();
    }
}

export const apiClient = new ApiClient(API_URL);

// Hook to initialize API client with auth token
export const useApiClient = () => {
    const { getToken } = useAuth();

    if (!apiClient.isReady()) {
        apiClient.setAuthTokenGetter(() => getToken());
    }

    return apiClient;
};
