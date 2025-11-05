/**
 * Collective-related types
 * Represents: collectives, collective_members tables
 */

export type CollectiveType = 'public' | 'private' | 'invite-only';
export type MemberRole = 'admin' | 'moderator' | 'member';

/**
 * Main Collective entity (collectives table)
 */
export interface Collective {
  id: string;                    // Primary key
  name: string;                  // Index
  slug: string;                  // Unique index
  description: string;
  icon: string;
  banner?: string;
  type: CollectiveType;          // Default: 'public'
  category: string;              // Index
  tags: string[];                // Related technologies
  memberCount: number;           // Default: 0
  questionCount: number;         // Default: 0
  createdAt: string;             // Timestamp
  createdBy: string;             // Foreign key -> users.id
  rules?: string;                // Community rules (Markdown)
  isOfficial: boolean;           // Default: false
  isActive: boolean;             // Default: true
}

/**
 * Collective member relationship (collective_members table)
 */
export interface CollectiveMember {
  id: string;                    // Primary key
  collectiveId: string;          // Foreign key -> collectives.id, Index
  userId: string;                // Foreign key -> users.id, Index
  role: MemberRole;              // Default: 'member'
  joinedAt: string;              // Timestamp
  reputation: number;            // Reputation within collective
}

/**
 * DTOs for collective operations
 */
export interface CreateCollectiveData {
  name: string;
  slug: string;
  description: string;
  icon: string;
  banner?: string;
  type: CollectiveType;
  category: string;
  tags?: string[];
  rules?: string;
  createdBy: string;
}

export interface UpdateCollectiveData {
  name?: string;
  description?: string;
  icon?: string;
  banner?: string;
  type?: CollectiveType;
  category?: string;
  tags?: string[];
  rules?: string;
  isActive?: boolean;
}

/**
 * Filters for querying collectives
 */
export interface CollectiveFilters {
  type?: CollectiveType;
  category?: string;
  tags?: string[];
  search?: string;
  isOfficial?: boolean;
  isActive?: boolean;
  sortBy?: 'name' | 'memberCount' | 'questionCount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

/**
 * Collective with member info
 */
export interface CollectiveWithDetails extends Collective {
  members?: CollectiveMember[];
  userMembership?: CollectiveMember; // Current user's membership
  topContributors?: string[];         // User IDs
  recentQuestions?: string[];         // Question IDs
}
