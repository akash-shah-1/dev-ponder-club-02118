import { Discussion, DiscussionReply, CreateDiscussionData, UpdateDiscussionData, CreateDiscussionReplyData, DiscussionFilters } from '../types';
import { apiClient } from '@/lib/api';

export const discussionsService = {
  async getAll(filters?: DiscussionFilters): Promise<Discussion[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    
    const query = params.toString();
    return apiClient.get<Discussion[]>(`/discussions${query ? `?${query}` : ''}`);
  },

  async getById(id: string): Promise<Discussion | null> {
    return apiClient.get<Discussion>(`/discussions/${id}`);
  },

  async create(data: CreateDiscussionData): Promise<Discussion> {
    return apiClient.post<Discussion>('/discussions', data);
  },

  async update(id: string, data: UpdateDiscussionData): Promise<Discussion> {
    return apiClient.patch<Discussion>(`/discussions/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/discussions/${id}`);
  },

  async getTrending(limit: number = 10): Promise<Discussion[]> {
    return apiClient.get<Discussion[]>(`/discussions?sortBy=trending&limit=${limit}`);
  },

  async addReply(discussionId: string, data: CreateDiscussionReplyData): Promise<DiscussionReply> {
    return apiClient.post<DiscussionReply>(`/discussions/${discussionId}/replies`, data);
  },

  async getReplies(discussionId: string): Promise<DiscussionReply[]> {
    return apiClient.get<DiscussionReply[]>(`/discussions/${discussionId}/replies`);
  },
};
