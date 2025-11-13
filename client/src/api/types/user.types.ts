/**
 * User-related types
 * Represents: users, badges, user_badges, user_stats tables
 */

export type UserRole = 'admin' | 'moderator' | 'user' | 'helper' | 'learner';
export type BadgeType = 'gold' | 'silver' | 'bronze' | 'helper' | 'learner' | 'special' | 'streak';

/**
 * Main User entity (users table)
 */
export interface User {
  id: string;                    // Primary key
  name: string;
  email: string;                 // Unique index
  avatar?: string;
  reputation: number;            // Default: 0, Index
  role: UserRole;                // Default: 'user'
  joinedAt: string;              // Timestamp
  questionsAnswered: number;     // Default: 0
  questionsAsked: number;        // Default: 0
  bio?: string;
  location?: string;
  website?: string;
  githubUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  lastActive?: string;           // Timestamp
}

/**
 * Badge entity (badges table + user_badges junction)
 */
export interface Badge {
  id: string;                    // Primary key
  name: string;
  type: BadgeType;
  icon: string;
  description: string;
  earnedAt: string;              // Timestamp
  userId: string;                // Foreign key -> users.id
}

/**
 * User statistics (computed/aggregated data)
 */
export interface UserStats {
  userId: string;                // Foreign key -> users.id
  totalReputation: number;
  questionsAsked: number;
  questionsAnswered: number;
  acceptedAnswers: number;
  upvotesReceived: number;
  downvotesReceived: number;
  currentStreak: number;         // Days
  longestStreak: number;         // Days
  totalReach: number;            // Question views
  badgesEarned: number;
}

/**
 * User activity log (user_activity table)
 */
export interface UserActivity {
  id: string;                    // Primary key
  userId: string;                // Foreign key -> users.id
  type: 'question' | 'answer' | 'comment' | 'upvote' | 'badge';
  targetId: string;              // Related question/answer/etc ID
  description: string;
  createdAt: string;             // Timestamp, Index
}

/**
 * User following relationship (user_follows table)
 */
export interface UserFollow {
  id: string;                    // Primary key
  followerId: string;            // Foreign key -> users.id
  followingId: string;           // Foreign key -> users.id
  createdAt: string;             // Timestamp
}

/**
 * DTOs for user operations
 */
export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface UpdateUserData {
  name?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  githubUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
}

export interface UserFilters {
  role?: UserRole;
  minReputation?: number;
  search?: string;
  sortBy?: 'reputation' | 'joinedAt' | 'questionsAsked' | 'questionsAnswered';
  sortOrder?: 'asc' | 'desc';
}
