import { Vote, VoteSummary, CreateVoteData } from '../types';
import { apiClient } from '@/lib/api';

export const votingService = {
  async upvoteQuestion(questionId: string): Promise<void> {
    return apiClient.post<void>('/votes', {
      targetId: questionId,
      targetType: 'QUESTION',
      type: 'UPVOTE'
    });
  },

  async downvoteQuestion(questionId: string): Promise<void> {
    return apiClient.post<void>('/votes', {
      targetId: questionId,
      targetType: 'QUESTION',
      type: 'DOWNVOTE'
    });
  },

  async upvoteAnswer(answerId: string): Promise<void> {
    return apiClient.post<void>('/votes', {
      targetId: answerId,
      targetType: 'ANSWER',
      type: 'UPVOTE'
    });
  },

  async downvoteAnswer(answerId: string): Promise<void> {
    return apiClient.post<void>('/votes', {
      targetId: answerId,
      targetType: 'ANSWER',
      type: 'DOWNVOTE'
    });
  },

  async getVoteStatus(itemId: string, userId: string, type: string): Promise<VoteSummary> {
    return apiClient.get<VoteSummary>(`/votes/${itemId}/status?targetType=${type}&userId=${userId}`);
  },

  async removeVote(itemId: string, userId: string, type: string): Promise<void> {
    // Note: This endpoint might need to be added to the backend
    return apiClient.delete<void>(`/votes/${itemId}?targetType=${type}`);
  },

  async createVote(data: CreateVoteData): Promise<Vote> {
    return apiClient.post<Vote>('/votes', data);
  },
};
