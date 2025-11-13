import { Answer, Comment, CreateAnswerData, UpdateAnswerData, CreateCommentData } from '../types';
import { apiClient } from '@/lib/api-client';

export const answersService = {
  async getAll(questionId?: string): Promise<Answer[]> {
    if (questionId) {
      return apiClient.get<Answer[]>(`/answers/question/${questionId}`);
    }
    return apiClient.get<Answer[]>('/answers');
  },

  async getById(id: string): Promise<Answer | null> {
    return apiClient.get<Answer>(`/answers/${id}`);
  },

  async create(data: CreateAnswerData): Promise<Answer> {
    return apiClient.post<Answer>('/answers', data);
  },

  async update(id: string, data: UpdateAnswerData): Promise<Answer> {
    return apiClient.patch<Answer>(`/answers/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/answers/${id}`);
  },

  async acceptAnswer(id: string): Promise<Answer> {
    return apiClient.patch<Answer>(`/answers/${id}/accept`, {});
  },

  async getByUser(userId: string): Promise<Answer[]> {
    return apiClient.get<Answer[]>(`/answers/user/${userId}`);
  },

  async addComment(answerId: string, data: CreateCommentData): Promise<Comment> {
    return apiClient.post<Comment>('/comments', { ...data, answerId });
  },

  async getComments(answerId: string): Promise<Comment[]> {
    return apiClient.get<Comment[]>(`/comments/answer/${answerId}`);
  },
};
