import { Notification, CreateNotificationData, NotificationFilters } from '../types';
import { apiClient } from '@/lib/api-client';

export const notificationsService = {
  async getAll(userId: string, filters?: NotificationFilters): Promise<Notification[]> {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.read !== undefined) params.append('read', filters.read.toString());
    
    const query = params.toString();
    return apiClient.get<Notification[]>(`/notifications${query ? `?${query}` : ''}`);
  },

  async getUnreadCount(userId: string): Promise<number> {
    const result = await apiClient.get<{ count: number }>('/notifications/unread-count');
    return result.count;
  },

  async markAsRead(id: string): Promise<Notification> {
    return apiClient.patch<Notification>(`/notifications/${id}/read`, {});
  },

  async markAllAsRead(userId: string): Promise<void> {
    return apiClient.patch<void>('/notifications/mark-all-read', {});
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/notifications/${id}`);
  },

  async create(data: CreateNotificationData): Promise<Notification> {
    // Note: This endpoint might need to be added to the backend
    return apiClient.post<Notification>('/notifications', data);
  },
};
