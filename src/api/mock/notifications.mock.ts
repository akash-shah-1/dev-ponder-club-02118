import { Notification } from '../types';
import { mockUsers } from './users.mock';

export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: '1',
    type: 'answer',
    title: 'New answer to your question',
    message: 'Marcus Johnson answered your question about JWT authentication',
    read: false,
    createdAt: '2024-03-01T11:00:00Z',
    actionUrl: '/questions/1',
    actorId: '3',
    actor: {
      id: mockUsers[2].id,
      name: mockUsers[2].name,
      avatar: mockUsers[2].avatar,
    },
    metadata: {
      questionId: '1',
      answerId: 'a1',
    },
  },
  {
    id: 'n2',
    userId: '1',
    type: 'upvote',
    title: 'Your answer was upvoted',
    message: 'Your answer received 5 upvotes',
    read: false,
    createdAt: '2024-03-01T09:30:00Z',
    actionUrl: '/questions/3#answer-a2',
    metadata: {
      questionId: '3',
      answerId: 'a2',
    },
  },
  {
    id: 'n3',
    userId: '1',
    type: 'badge',
    title: 'New badge earned!',
    message: 'You earned the "Best Explainer" badge',
    read: true,
    createdAt: '2024-01-15T00:00:00Z',
    actionUrl: '/profile/badges',
    metadata: {
      badgeId: 'b1',
    },
  },
  {
    id: 'n4',
    userId: '2',
    type: 'comment',
    title: 'New comment on your question',
    message: 'Sarah Chen commented on your question',
    read: false,
    createdAt: '2024-03-01T10:15:00Z',
    actionUrl: '/questions/2',
    actorId: '1',
    actor: {
      id: mockUsers[0].id,
      name: mockUsers[0].name,
      avatar: mockUsers[0].avatar,
    },
    metadata: {
      questionId: '2',
    },
  },
];
