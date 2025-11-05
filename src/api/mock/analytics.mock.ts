import { AnalyticsData } from '../types';
import { mockUsers } from './users.mock';

export const mockAnalytics: AnalyticsData = {
  totalQuestions: 1247,
  solvedQuestions: 950,
  activeUsers: 892,
  topHelpers: mockUsers.slice(0, 3),
  categoryBreakdown: {
    frontend: 456,
    backend: 389,
    devops: 178,
    database: 134,
    mobile: 90,
  },
  weeklyActivity: [
    { date: '2024-02-26', questions: 12, answers: 28 },
    { date: '2024-02-27', questions: 15, answers: 32 },
    { date: '2024-02-28', questions: 18, answers: 35 },
    { date: '2024-02-29', questions: 14, answers: 30 },
    { date: '2024-03-01', questions: 20, answers: 42 },
    { date: '2024-03-02', questions: 16, answers: 38 },
    { date: '2024-03-03', questions: 19, answers: 41 },
  ],
};
