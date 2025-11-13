import { Vote, VoteSummary, CreateVoteData } from '../types';
import { apiClient } from '@/lib/api-client';

export const votingService = {
  async upvoteQuestion(questionId: string, userId: string): Promise<void> {
    return apiClient.post<void>('/votes', {
      targetId: questionId,
      targetType: 'question',
      voteType: 'upvote'
    });
  },

  async downvoteQuestion(questionId: string, userId: string): Promise<void> {
    return apiClient.post<void>('/votes', {
      targetId: questionId,
      targetType: 'question',
      voteType: 'downvote'
    });
  },

  async upvoteAnswer(answerId: string, userId: string): Promise<void> {
    return apiClient.post<void>('/votes', {
      targetId: answerId,
      targetType: 'answer',
      voteType: 'upvote'
    });
  },

  async downvoteAnswer(answerId: string, userId: string): Promise<void> {
    return apiClient.post<void>('/votes', {
      targetId: answerId,
      targetType: 'answer',
      voteType: 'downvote'
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
