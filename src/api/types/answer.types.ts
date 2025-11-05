/**
 * Answer-related types
 * Represents: answers, comments tables
 */

/**
 * Main Answer entity (answers table)
 */
export interface Answer {
  id: string;                    // Primary key
  questionId: string;            // Foreign key -> questions.id, Index
  content: string;               // Full answer text
  authorId: string;              // Foreign key -> users.id, Index
  author: any;
  createdAt: string;             // Timestamp, Index
  updatedAt: string;             // Timestamp
  upvotes: number;               // Default: 0
  downvotes: number;             // Default: 0
  isAccepted: boolean;           // Default: false, Index
  commentCount: number;          // Default: 0
}

/**
 * Comment entity (comments table)
 */
export interface Comment {
  id: string;                    // Primary key
  answerId: string;              // Foreign key -> answers.id, Index
  content: string;
  authorId: string;              // Foreign key -> users.id
  author: any;
  createdAt: string;             // Timestamp
  upvotes: number;               // Default: 0
}

/**
 * DTOs for answer operations
 */
export interface CreateAnswerData {
  questionId: string;
  content: string;               // Min 30 chars
  authorId: string;
}

export interface UpdateAnswerData {
  content?: string;
}

export interface CreateCommentData {
  answerId: string;
  content: string;               // Min 10, Max 500 chars
  authorId: string;
}

/**
 * Filters for querying answers
 */
export interface AnswerFilters {
  questionId?: string;
  authorId?: string;
  isAccepted?: boolean;
  minUpvotes?: number;
  sortBy?: 'createdAt' | 'upvotes';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Answer with populated relationships
 */
export interface AnswerWithDetails extends Answer {
  comments?: Comment[];
}
