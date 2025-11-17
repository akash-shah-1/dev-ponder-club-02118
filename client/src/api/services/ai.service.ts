import { apiClient } from '@/lib/api';

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

export interface AiSummaryResponse {
  summary: string;
  questionId: string;
  generatedAt: string;
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

  // Get existing AI answer for a question
  async getAiAnswer(questionId: string): Promise<AiAnswerResponse | null> {
    const response: any = await apiClient.get(`/ai/answer-question/${questionId}`);
    if (!response.exists) {
      return null;
    }
    return response as AiAnswerResponse;
  },

  // Generate summary of question and answers
  async generateSummary(questionId: string, questionTitle: string, questionDescription: string, answers: any[]): Promise<AiSummaryResponse> {
    return apiClient.post<AiSummaryResponse>('/ai/generate-summary', {
      questionId,
      questionTitle,
      questionDescription,
      answers,
    });
  },

  // Convert text to speech using ElevenLabs
  async textToSpeech(text: string): Promise<string> {
    const response: any = await apiClient.post('/ai/text-to-speech', { text });
    return response.audioContent;
  },

  // Get available voices
  async getVoices(): Promise<any[]> {
    return apiClient.get('/ai/voices');
  },
};
