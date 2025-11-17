import { Tag, TagStats, CreateTagData, UpdateTagData, TagFilters } from '../types';
import { apiClient } from '@/lib/api';

export const tagsService = {
  async getAll(filters?: TagFilters): Promise<Tag[]> {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.minCount) params.append('minCount', filters.minCount.toString());
    
    const query = params.toString();
    return apiClient.get<Tag[]>(`/tags${query ? `?${query}` : ''}`);
  },

  async getById(id: string): Promise<Tag | null> {
    return apiClient.get<Tag>(`/tags/${id}`);
  },

  async getTrending(limit: number = 10): Promise<Tag[]> {
    return apiClient.get<Tag[]>(`/tags/popular?limit=${limit}`);
  },

  async searchTags(query: string): Promise<Tag[]> {
    return apiClient.get<Tag[]>(`/tags/search?q=${encodeURIComponent(query)}`);
  },

  async getQuestionsByTag(tag: string): Promise<string[]> {
    const result = await apiClient.get<any>(`/tags/${tag}`);
    return result.questions || [];
  },

  async watchTag(userId: string, tagId: string): Promise<void> {
    return apiClient.post<void>(`/tag-watches/tags/${tagId}`, {});
  },

  async unwatchTag(userId: string, tagId: string): Promise<void> {
    return apiClient.delete<void>(`/tag-watches/tags/${tagId}`);
  },

  async getUserWatchedTags(userId: string): Promise<Tag[]> {
    return apiClient.get<Tag[]>('/tag-watches/my-tags');
  },

  async create(data: CreateTagData): Promise<Tag> {
    // Note: This endpoint might need to be added to the backend
    return apiClient.post<Tag>('/tags', data);
  },

  async update(id: string, data: UpdateTagData): Promise<Tag> {
    // Note: This endpoint might need to be added to the backend
    return apiClient.patch<Tag>(`/tags/${id}`, data);
  },
};
