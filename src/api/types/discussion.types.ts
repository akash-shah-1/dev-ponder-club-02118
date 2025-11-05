/**
 * Discussion-related types
 * Represents: discussions, discussion_replies tables
 */

export type DiscussionCategory = 'general' | 'announcements' | 'ideas' | 'feedback' | 'help';
export type DiscussionStatus = 'open' | 'closed' | 'pinned';

/**
 * Main Discussion entity (discussions table)
 */
export interface Discussion {
  id: string;                    // Primary key
  title: string;                 // Index
  content: string;
  category: DiscussionCategory;  // Index
  status: DiscussionStatus;      // Default: 'open'
  authorId: string;              // Foreign key -> users.id, Index
  author: any;
  createdAt: string;             // Timestamp, Index
  updatedAt: string;             // Timestamp
  views: number;                 // Default: 0
  upvotes: number;               // Default: 0
  replyCount: number;            // Default: 0
  lastReplyAt?: string;          // Timestamp
  tags?: string[];
  isPinned: boolean;             // Default: false
}

/**
 * Discussion reply entity (discussion_replies table)
 */
export interface DiscussionReply {
  id: string;                    // Primary key
  discussionId: string;          // Foreign key -> discussions.id, Index
  content: string;
  authorId: string;              // Foreign key -> users.id
  author: any;
  createdAt: string;             // Timestamp
  updatedAt: string;             // Timestamp
  upvotes: number;               // Default: 0
  parentReplyId?: string;        // Foreign key -> discussion_replies.id (for nested replies)
}

/**
 * DTOs for discussion operations
 */
export interface CreateDiscussionData {
  title: string;                 // Min 10, Max 200 chars
  content: string;               // Min 30 chars
  category: DiscussionCategory;
  tags?: string[];
  authorId: string;
}

export interface UpdateDiscussionData {
  title?: string;
  content?: string;
  category?: DiscussionCategory;
  status?: DiscussionStatus;
  tags?: string[];
}

export interface CreateDiscussionReplyData {
  discussionId: string;
  content: string;               // Min 10 chars
  authorId: string;
  parentReplyId?: string;
}

/**
 * Filters for querying discussions
 */
export interface DiscussionFilters {
  category?: DiscussionCategory;
  status?: DiscussionStatus;
  authorId?: string;
  search?: string;
  tags?: string[];
  isPinned?: boolean;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'createdAt' | 'views' | 'upvotes' | 'replyCount' | 'lastReplyAt';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

/**
 * Discussion with populated relationships
 */
export interface DiscussionWithDetails extends Discussion {
  replies?: DiscussionReply[];
}
