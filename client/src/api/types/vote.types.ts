/**
 * Voting-related types
 * Represents: votes table
 */

export type VoteType = 'upvote' | 'downvote';
export type VoteTargetType = 'question' | 'answer' | 'discussion' | 'discussion_reply';

/**
 * Vote entity (votes table)
 */
export interface Vote {
  id: string;                    // Primary key
  userId: string;                // Foreign key -> users.id, Index
  targetType: VoteTargetType;    // Type of content being voted on
  targetId: string;              // ID of the content, Index
  voteType: VoteType;            // upvote or downvote
  createdAt: string;             // Timestamp
  
  // Composite unique index: (userId, targetType, targetId)
}

/**
 * Vote summary for an item (computed)
 */
export interface VoteSummary {
  targetId: string;
  targetType: VoteTargetType;
  upvotes: number;
  downvotes: number;
  score: number;                 // upvotes - downvotes
  userVote?: VoteType | null;    // Current user's vote
}

/**
 * DTOs for vote operations
 */
export interface CreateVoteData {
  userId: string;
  targetType: VoteTargetType;
  targetId: string;
  voteType: VoteType;
}

/**
 * Reputation change log (reputation_changes table)
 */
export interface ReputationChange {
  id: string;                    // Primary key
  userId: string;                // Foreign key -> users.id, Index
  change: number;                // +5, +10, -2, etc.
  reason: ReputationReason;
  relatedId?: string;            // Question/Answer ID that caused change
  createdAt: string;             // Timestamp
}

export type ReputationReason =
  | 'question_upvote'            // +5
  | 'question_downvote'          // -2
  | 'answer_upvote'              // +10
  | 'answer_downvote'            // -2
  | 'answer_accepted'            // +15
  | 'accept_answer'              // +2 (for question asker)
  | 'badge_earned'               // Varies
  | 'bounty_awarded'             // Varies
  | 'spam_penalty';              // -100
