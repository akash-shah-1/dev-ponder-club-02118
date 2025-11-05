import { User, UserStats, UserActivity, Badge, UpdateUserData, UserFilters } from '../types';
import { mockUsers, mockUserStats, mockUserActivity } from '../mock';

const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const usersService = {
  async getCurrentUser(): Promise<User> {
    await delay();
    return mockUsers[0];
  },

  async getById(id: string): Promise<User | null> {
    await delay();
    return mockUsers.find(u => u.id === id) || null;
  },

  async getTopHelpers(limit: number = 10): Promise<User[]> {
    await delay();
    return [...mockUsers]
      .sort((a, b) => b.reputation - a.reputation)
      .slice(0, limit);
  },

  async updateProfile(id: string, data: UpdateUserData): Promise<User> {
    await delay();
    const user = mockUsers.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return { ...user, ...data };
  },

  async getUserStats(id: string): Promise<UserStats | null> {
    await delay();
    return mockUserStats[id] || null;
  },

  async getUserBadges(id: string): Promise<Badge[]> {
    await delay();
    return [];
  },

  async getUserActivity(id: string): Promise<UserActivity[]> {
    await delay();
    return mockUserActivity.filter(a => a.userId === id);
  },

  async searchUsers(query: string): Promise<User[]> {
    await delay();
    const search = query.toLowerCase();
    return mockUsers.filter(u =>
      u.name.toLowerCase().includes(search) ||
      u.email.toLowerCase().includes(search)
    );
  },

  async followUser(userId: string, targetId: string): Promise<void> {
    await delay();
  },

  async unfollowUser(userId: string, targetId: string): Promise<void> {
    await delay();
  },

  async getAll(filters?: UserFilters): Promise<User[]> {
    await delay();
    let results = [...mockUsers];

    if (filters?.role) {
      results = results.filter(u => u.role === filters.role);
    }
    if (filters?.minReputation) {
      results = results.filter(u => u.reputation >= filters.minReputation);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      results = results.filter(u =>
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search)
      );
    }

    return results;
  },
};
