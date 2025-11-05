import { Notification, CreateNotificationData, NotificationFilters } from '../types';
import { mockNotifications } from '../mock';

const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const notificationsService = {
  async getAll(userId: string, filters?: NotificationFilters): Promise<Notification[]> {
    await delay();
    let results = mockNotifications.filter(n => n.userId === userId);

    if (filters?.type) {
      results = results.filter(n => n.type === filters.type);
    }
    if (filters?.read !== undefined) {
      results = results.filter(n => n.read === filters.read);
    }

    return results;
  },

  async getUnreadCount(userId: string): Promise<number> {
    await delay();
    return mockNotifications.filter(n => n.userId === userId && !n.read).length;
  },

  async markAsRead(id: string): Promise<Notification> {
    await delay();
    const notification = mockNotifications.find(n => n.id === id);
    if (!notification) throw new Error('Notification not found');
    return { ...notification, read: true };
  },

  async markAllAsRead(userId: string): Promise<void> {
    await delay();
  },

  async delete(id: string): Promise<void> {
    await delay();
  },

  async create(data: CreateNotificationData): Promise<Notification> {
    await delay();
    const newNotification: Notification = {
      id: Date.now().toString(),
      ...data,
      read: false,
      createdAt: new Date().toISOString(),
    };
    return newNotification;
  },
};
