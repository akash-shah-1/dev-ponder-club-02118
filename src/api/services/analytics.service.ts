import { AnalyticsData } from '../types';
import { mockAnalytics } from '../mock';

const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const analyticsService = {
  async getOverallAnalytics(): Promise<AnalyticsData> {
    await delay();
    return mockAnalytics;
  },

  async getUserStats(userId: string): Promise<any> {
    await delay();
    return {
      questionsAsked: 23,
      questionsAnswered: 87,
      totalViews: 12450,
      reputation: 2450,
    };
  },

  async getCategoryBreakdown(): Promise<Record<string, number>> {
    await delay();
    return mockAnalytics.categoryBreakdown;
  },

  async getWeeklyActivity(): Promise<Array<{ date: string; questions: number; answers: number }>> {
    await delay();
    return mockAnalytics.weeklyActivity;
  },

  async getTopContributors(limit: number = 10): Promise<any[]> {
    await delay();
    return mockAnalytics.topHelpers.slice(0, limit);
  },
};
