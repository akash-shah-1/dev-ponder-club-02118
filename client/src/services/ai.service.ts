import { apiClient } from '../lib/api';

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

export interface AiStats {
  totalQueries: number;
  totalAiAnswers: number;
  acceptedAiAnswers: number;
  acceptanceRate: string;
}

export const aiService = {
  async generateAnswer(questionId: string): Promise<AiAnswer> {
    const response = await apiClient.post(`/ai/generate-answer/${questionId}`);
    return response.data;
  },

  async findSimilarQuestions(questionId: string) {
    const response = await apiClient.get(`/ai/similar-questions/${questionId}`);
    return response.data;
  },

  async checkExistingAiAnswer(questionId: string): Promise<{ exists: boolean; answerId?: string }> {
    const response = await apiClient.get(`/ai/check-existing/${questionId}`);
    return response.data;
  },

  async getAiStats(): Promise<AiStats> {
    const response = await apiClient.get('/ai/stats');
    return response.data;
  },
};
