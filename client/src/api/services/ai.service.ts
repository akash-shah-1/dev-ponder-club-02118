import { apiClient } from '@/lib/api-client';

export interface AiChatResponse {
  answer: string;
  model: string;
  tokensUsed: number;
}

export const aiService = {
  // Chat with AI - ask any question and get an answer
  async chat(question: string): Promise<AiChatResponse> {
    return apiClient.post<AiChatResponse>('/ai/chat', { question });
  },
};
