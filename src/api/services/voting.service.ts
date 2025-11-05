import { Vote, VoteSummary, CreateVoteData } from '../types';
import { mockVotes } from '../mock/votes.mock';

const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const votingService = {
  async upvoteQuestion(questionId: string, userId: string): Promise<void> {
    await delay();
  },

  async downvoteQuestion(questionId: string, userId: string): Promise<void> {
    await delay();
  },

  async upvoteAnswer(answerId: string, userId: string): Promise<void> {
    await delay();
  },

  async downvoteAnswer(answerId: string, userId: string): Promise<void> {
    await delay();
  },

  async getVoteStatus(itemId: string, userId: string, type: string): Promise<VoteSummary> {
    await delay();
    const votes = mockVotes.filter(v => v.targetId === itemId);
    const upvotes = votes.filter(v => v.voteType === 'upvote').length;
    const downvotes = votes.filter(v => v.voteType === 'downvote').length;
    const userVote = votes.find(v => v.userId === userId);

    return {
      targetId: itemId,
      targetType: type as any,
      upvotes,
      downvotes,
      score: upvotes - downvotes,
      userVote: userVote?.voteType || null,
    };
  },

  async removeVote(itemId: string, userId: string, type: string): Promise<void> {
    await delay();
  },

  async createVote(data: CreateVoteData): Promise<Vote> {
    await delay();
    const newVote: Vote = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
    };
    return newVote;
  },
};
