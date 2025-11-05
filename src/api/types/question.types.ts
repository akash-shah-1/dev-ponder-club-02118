/**
 * Question-related types
 * Represents: questions, question_tags tables
 */

export type QuestionCategory = 'frontend' | 'backend' | 'devops' | 'mobile' | 'database' | 'security' | 'other';
export type QuestionStatus = 'open' | 'solved' | 'closed';

/**
 * Main Question entity (questions table)
 */
export interface Question {
  id: string;                    // Primary key
  title: string;                 // Index for search
  description: string;           // Full text search index
  excerpt: string;               // First 150 chars
  tags: string[];                // Array of tag names
  category: QuestionCategory;    // Index
  authorId: string;              // Foreign key -> users.id, Index
  author: any;
  createdAt: string;             // Timestamp, Index
  updatedAt: string;             // Timestamp
  views: number;                 // Default: 0, Index
  upvotes: number;               // Default: 0
  downvotes: number;             // Default: 0
  answerCount: number;           // Default: 0
  solved: boolean;               // Default: false, Index
  acceptedAnswerId?: string;     // Foreign key -> answers.id
  status: QuestionStatus;        // Default: 'open'
  answers?: any[];               // Populated answers (for compatibility)
}

/**
 * Question tag relationship (question_tags table - many-to-many)
 */
export interface QuestionTag {
  questionId: string;            // Foreign key -> questions.id
  tagId: string;                 // Foreign key -> tags.id
  createdAt: string;             // Timestamp
}

/**
 * DTOs for question operations
 */
export interface CreateQuestionData {
  title: string;                 // Min 10, Max 200 chars
  description: string;           // Min 30 chars
  tags: string[];                // Min 1, Max 5 tags
  category: QuestionCategory;
  authorId: string;
}

export interface UpdateQuestionData {
  title?: string;
  description?: string;
  tags?: string[];
  category?: QuestionCategory;
  status?: QuestionStatus;
}

/**
 * Filters for querying questions
 */
export interface QuestionFilters {
  category?: QuestionCategory;
  tags?: string[];               // Filter by any of these tags
  authorId?: string;
  solved?: boolean;
  status?: QuestionStatus;
  search?: string;               // Full-text search
  minViews?: number;
  minUpvotes?: number;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'createdAt' | 'views' | 'upvotes' | 'answerCount';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

/**
 * Question with populated relationships
 */
export interface QuestionWithDetails extends Question {
  answers?: Answer[];
  savedByUsers?: string[];       // User IDs who saved this
}

// Import Answer type (defined in answer.types.ts)
interface Answer {
  id: string;
  content: string;
  authorId: string;
  createdAt: string;
}
