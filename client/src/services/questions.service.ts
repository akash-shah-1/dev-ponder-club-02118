import { apiClient } from '@/lib/api';
import { Question, CreateQuestionData, QuestionFilters } from '@/api/types';

export const questionsService = {
  async getAll(filters?: QuestionFilters): Promise<Question[]> {
    const params = new URLSearchParams();
    
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.tag) params.append('tag', filters.tag);
    
    const query = params.toString();
    return apiClient.get<Question[]>(`/questions${query ? `?${query}` : ''}`);
  },

  async getById(id: string): Promise<Question> {
    return apiClient.get<Question>(`/questions/${id}`);
  },

  async create(data: CreateQuestionData, token: string): Promise<Question> {
    return apiClient.post<Question>('/questions', data, token);
  },

  async update(id: string, data: Partial<CreateQuestionData>, token: string): Promise<Question> {
    return apiClient.patch<Question>(`/questions/${id}`, data, token);
  },

  async delete(id: string, token: string): Promise<void> {
    return apiClient.delete<void>(`/questions/${id}`, token);
  },

  async markAsSolved(id: string, token: string): Promise<Question> {
    return apiClient.patch<Question>(`/questions/${id}/solve`, {}, token);
  },

  async getTrending(limit?: number): Promise<Question[]> {
    const query = limit ? `?limit=${limit}` : '';
    return apiClient.get<Question[]>(`/questions/trending${query}`);
  },

  async getByUser(userId: string): Promise<Question[]> {
    return apiClient.get<Question[]>(`/questions/user/${userId}`);
  },
};