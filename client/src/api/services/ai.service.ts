import { Question } from '../types';
import { apiClient } from '@/lib/api-client';

export interface AiAnswer {
  answer: {
    id: string;
    content: string;
    isAiGenerated: boolean;
    aiModel: string;
    aiConfidence: number;
    author: {
      id: string;
      name: string;
      avatar: string;
    };
    createdAt: string;
  };
  similarQuestions: Array<{
    id: string;
    title: string;
    similarity: number;
  }>;
}

export interface SimilarQuestion {
  id: string;
  title: string;
  description: string;
  tags: Array<{ name: string }>;
  similarity: number;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: string;
}

export const aiService = {
  // Generate AI answer for a specific question
  async generateAnswer(questionId: string): Promise<AiAnswer> {
    return apiClient.post<AiAnswer>(`/ai/generate-answer/${questionId}`);
  },

  // Check if AI answer already exists for a question
  async checkExistingAiAnswer(questionId: string): Promise<{ exists: boolean; answerId?: string }> {
    return apiClient.get<{ exists: boolean; answerId?: string }>(`/ai/check-existing/${questionId}`);
  },

  // Find similar questions using AI
  async findSimilarQuestions(questionId: string): Promise<SimilarQuestion[]> {
    return apiClient.get<SimilarQuestion[]>(`/ai/similar-questions/${questionId}`);
  },

  // Get AI usage statistics
  async getAiStats(): Promise<{
    totalQueries: number;
    totalAiAnswers: number;
    acceptedAiAnswers: number;
    acceptanceRate: string;
  }> {
    return apiClient.get('/ai/stats');
  },

  // Search questions by text (uses your existing questions API)
  async searchQuestions(query: string): Promise<Question[]> {
    return apiClient.get<Question[]>(`/questions?search=${encodeURIComponent(query)}`);
  },
};
