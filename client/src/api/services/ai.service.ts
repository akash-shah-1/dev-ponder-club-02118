import { apiClient } from '@/lib/api-client';

export interface SimilarQuestion {
  id: string;
  title: string;
  similarity: number;
  tags: string[];
  answerCount: number;
}

export interface AiChatResponse {
  answer: string;
  model: string;
  tokensUsed: number;
  similarQuestions?: SimilarQuestion[];
  contextUsed?: boolean;
}

export interface AiAnswerResponse {
  answer: string;
  model: string;
  questionId: string;
  isAiGenerated: boolean;
  generatedAt: string;
  images?: string[]; // Base64 encoded images
}

export const aiService = {
  // Chat with AI - ask any question and get an answer
  async chat(question: string): Promise<AiChatResponse> {
    return apiClient.post<AiChatResponse>('/ai/chat', { question });
  },

  // Generate detailed AI answer for a question with examples
  async answerQuestion(questionId: string, questionTitle: string, questionDescription: string): Promise<AiAnswerResponse> {
    return apiClient.post<AiAnswerResponse>('/ai/answer-question', {
      questionId,
      questionTitle,
      questionDescription,
    });
  },
};
