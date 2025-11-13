/**
 * Analytics-related types
 * Represents aggregated/computed data for dashboards
 */

/**
 * Overall platform analytics
 */
export interface AnalyticsData {
  totalQuestions: number;
  solvedQuestions: number;
  activeUsers: number;
  topHelpers: any[];
  categoryBreakdown: Record<string, number>;
  weeklyActivity: { date: string; questions: number; answers: number }[];
}

/**
 * Statistics by category
 */
export interface CategoryStats {
  category: string;
  questionCount: number;
  answerCount: number;
  viewCount: number;
  solvedCount: number;
  averageUpvotes: number;
}

/**
 * Weekly activity data
 */
export interface WeeklyStats {
  date: string;                  // ISO date string
  questions: number;
  answers: number;
  users: number;
  views: number;
}

/**
 * Tag popularity metrics
 */
export interface TagPopularity {
  tag: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
  weeklyGrowth: number;          // Percentage
}

/**
 * User-specific analytics
 */
export interface UserAnalytics {
  userId: string;
  totalReputation: number;
  questionsAsked: number;
  questionsAnswered: number;
  acceptedAnswers: number;
  upvotesReceived: number;
  downvotesReceived: number;
  currentStreak: number;
  longestStreak: number;
  totalReach: number;            // Total views on user's content
  badgesEarned: number;
  topTags: string[];             // User's most used tags
  activityByDay: DailyActivity[];
  reputationHistory: ReputationHistory[];
}

/**
 * Daily activity breakdown
 */
export interface DailyActivity {
  date: string;
  questions: number;
  answers: number;
  upvotes: number;
  reputation: number;
}

/**
 * Reputation change over time
 */
export interface ReputationHistory {
  date: string;
  reputation: number;
  change: number;
}

/**
 * Question analytics (for question owners)
 */
export interface QuestionAnalytics {
  questionId: string;
  views: number;
  uniqueViews: number;
  upvotes: number;
  downvotes: number;
  answerCount: number;
  averageAnswerTime: number;     // Hours
  viewsByDate: { date: string; views: number }[];
  referringSources: { source: string; count: number }[];
  userDemographics?: {
    byReputation: { range: string; count: number }[];
    byLocation: { location: string; count: number }[];
  };
}

/**
 * Leaderboard data
 */
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  score: number;
  change: number;                // Position change from previous period
  metric: 'reputation' | 'answers' | 'questions' | 'helpful';
}

/**
 * Time period for analytics queries
 */
export type AnalyticsPeriod = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'all';

/**
 * Analytics filters
 */
export interface AnalyticsFilters {
  period?: AnalyticsPeriod;
  dateFrom?: string;
  dateTo?: string;
  category?: string;
  tag?: string;
  userId?: string;
}
