import { SavedItem, CreateSaveData, UpdateSaveData, SavedItemFilters } from '../types';
import { apiClient } from '@/lib/api-client';

export const savesService = {
  async getSavedQuestions(userId: string): Promise<SavedItem[]> {
    return apiClient.get<SavedItem[]>('/saves');
  },

  async getSavedAnswers(userId: string): Promise<SavedItem[]> {
    return apiClient.get<SavedItem[]>('/saves?type=answer');
  },

  async getSavedTags(userId: string): Promise<SavedItem[]> {
    return apiClient.get<SavedItem[]>('/saves?type=tag');
  },

  async saveQuestion(userId: string, questionId: string): Promise<SavedItem> {
    return apiClient.post<SavedItem>(`/saves/questions/${questionId}`, {});
  },

  async saveAnswer(userId: string, answerId: string): Promise<SavedItem> {
    return apiClient.post<SavedItem>(`/saves/answers/${answerId}`, {});
  },

  async saveTag(userId: string, tagId: string): Promise<SavedItem> {
    return apiClient.post<SavedItem>(`/saves/tags/${tagId}`, {});
  },

  async unsaveQuestion(userId: string, questionId: string): Promise<void> {
    return apiClient.delete<void>(`/saves/questions/${questionId}`);
  },

  async unsaveAnswer(userId: string, answerId: string): Promise<void> {
    return apiClient.delete<void>(`/saves/answers/${answerId}`);
  },

  async unsaveTag(userId: string, tagId: string): Promise<void> {
    return apiClient.delete<void>(`/saves/tags/${tagId}`);
  },

  async getAll(filters: SavedItemFilters): Promise<SavedItem[]> {
    const params = new URLSearchParams();
    if (filters.itemType) params.append('type', filters.itemType);
    
    const query = params.toString();
    return apiClient.get<SavedItem[]>(`/saves${query ? `?${query}` : ''}`);
  },
};
