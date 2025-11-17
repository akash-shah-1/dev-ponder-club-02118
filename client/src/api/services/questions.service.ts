import { Question, CreateQuestionData, QuestionFilters, UpdateQuestionData } from '../types';
import { apiClient } from '@/lib/api';

export const questionsService = {
  async getAll(filters?: QuestionFilters): Promise<Question[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.tags?.length) params.append('tag', filters.tags[0]);
    
    const query = params.toString();
    return apiClient.get<Question[]>(`/questions${query ? `?${query}` : ''}`);
  },

  async getById(id: string): Promise<Question | null> {
    return apiClient.get<Question>(`/questions/${id}`);
  },

  async create(data: CreateQuestionData): Promise<Question> {
    return apiClient.post<Question>('/questions', data);
  },

  async update(id: string, data: UpdateQuestionData): Promise<Question> {
    return apiClient.patch<Question>(`/questions/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/questions/${id}`);
  },

  async searchQuestions(query: string): Promise<Question[]> {
    return apiClient.get<Question[]>(`/questions?search=${encodeURIComponent(query)}`);
  },

  async getByCategory(category: string): Promise<Question[]> {
    return apiClient.get<Question[]>(`/questions?category=${encodeURIComponent(category)}`);
  },

  async getByTag(tag: string): Promise<Question[]> {
    return apiClient.get<Question[]>(`/questions?tag=${encodeURIComponent(tag)}`);
  },

  async getByUser(userId: string): Promise<Question[]> {
    return apiClient.get<Question[]>(`/questions/user/${userId}`);
  },

  async getTrending(limit: number = 10): Promise<Question[]> {
    return apiClient.get<Question[]>(`/questions/trending?limit=${limit}`);
  },

  async markAsSolved(id: string): Promise<Question> {
    return apiClient.patch<Question>(`/questions/${id}/solve`, {});
  },

  async upvoteQuestion(id: string): Promise<void> {
    return apiClient.post<void>('/votes', {
      targetId: id,
      targetType: 'question',
      voteType: 'upvote'
    });
  },
};
