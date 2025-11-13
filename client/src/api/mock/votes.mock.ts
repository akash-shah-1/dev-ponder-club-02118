import { Vote } from '../types';

export const mockVotes: Vote[] = [
  {
    id: 'v1',
    userId: '1',
    targetType: 'question',
    targetId: '1',
    voteType: 'upvote',
    createdAt: '2024-03-01T10:00:00Z',
  },
  {
    id: 'v2',
    userId: '2',
    targetType: 'answer',
    targetId: 'a1',
    voteType: 'upvote',
    createdAt: '2024-03-01T11:00:00Z',
  },
];
