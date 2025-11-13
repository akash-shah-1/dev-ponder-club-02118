import { apiClient } from '@/lib/api-client';

export interface UserStats {
  questions: number;
  answers: number;
  reach: number;
  acceptedAnswers: number;
}

export interface UserActivity {
  type: 'question' | 'answer';
  id: string;
  title: string;
  questionId?: string;
  createdAt: string;
}

export interface UpdateUserProfile {
  name?: string;
  email?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  githubUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  dateOfBirth?: string;
}

export const userService = {
  getCurrentUserStats: async (): Promise<UserStats> => {
    return apiClient.get<UserStats>('/users/me/stats');
  },

  getCurrentUserActivity: async (): Promise<UserActivity[]> => {
    return apiClient.get<UserActivity[]>('/users/me/activity');
  },

  getUserStats: async (userId: string): Promise<UserStats> => {
    return apiClient.get<UserStats>(`/users/${userId}/stats`);
  },

  getUserActivity: async (userId: string): Promise<UserActivity[]> => {
    return apiClient.get<UserActivity[]>(`/users/${userId}/activity`);
  },

  updateProfile: async (data: UpdateUserProfile) => {
    return apiClient.put('/users/me', data);
  },
};
