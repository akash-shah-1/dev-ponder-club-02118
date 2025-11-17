import { User, UserStats, UserActivity, Badge, UpdateUserData, UserFilters } from '../types';
import { apiClient } from '@/lib/api';

export const usersService = {
  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/users/me');
  },

  async getById(id: string): Promise<User | null> {
    return apiClient.get<User>(`/users/${id}`);
  },

  async getTopHelpers(limit: number = 10): Promise<User[]> {
    return apiClient.get<User[]>('/users/top');
  },

  async updateProfile(id: string, data: UpdateUserData): Promise<User> {
    return apiClient.put<User>('/users/me', data);
  },

  async getUserStats(id: string): Promise<UserStats | null> {
    // Note: This endpoint might need to be added to the backend
    return apiClient.get<UserStats>(`/users/${id}/stats`);
  },

  async getUserBadges(id: string): Promise<Badge[]> {
    // Note: This endpoint might need to be added to the backend
    return apiClient.get<Badge[]>(`/users/${id}/badges`);
  },

  async getUserActivity(id: string): Promise<UserActivity[]> {
    // Note: This endpoint might need to be added to the backend
    return apiClient.get<UserActivity[]>(`/users/${id}/activity`);
  },

  async searchUsers(query: string): Promise<User[]> {
    return apiClient.get<User[]>(`/users?search=${encodeURIComponent(query)}`);
  },

  async followUser(userId: string, targetId: string): Promise<void> {
    return apiClient.post<void>(`/follows/users/${targetId}`, {});
  },

  async unfollowUser(userId: string, targetId: string): Promise<void> {
    return apiClient.delete<void>(`/follows/users/${targetId}`);
  },

  async getAll(filters?: UserFilters): Promise<User[]> {
    const params = new URLSearchParams();
    if (filters?.role) params.append('role', filters.role);
    if (filters?.minReputation) params.append('minReputation', filters.minReputation.toString());
    if (filters?.search) params.append('search', filters.search);
    
    const query = params.toString();
    return apiClient.get<User[]>(`/users${query ? `?${query}` : ''}`);
  },
};
