/**
 * Tag-related types
 * Represents: tags, tag_watches, tag_stats tables
 */

/**
 * Main Tag entity (tags table)
 */
export interface Tag {
  id: string;                    // Primary key
  name: string;                  // Unique index, lowercase
  displayName: string;           // Display format (e.g., "JavaScript")
  description: string;
  count: number;                 // Number of questions, Index
  category?: string;
  createdAt: string;             // Timestamp
  color?: string;                // Hex color for UI
  icon?: string;                 // Icon name
}

/**
 * Tag watch relationship (tag_watches table)
 */
export interface TagWatch {
  id: string;                    // Primary key
  userId: string;                // Foreign key -> users.id
  tagId: string;                 // Foreign key -> tags.id
  createdAt: string;             // Timestamp
}

/**
 * Tag statistics (tag_stats table - computed)
 */
export interface TagStats {
  tagId: string;                 // Foreign key -> tags.id
  questionCount: number;
  answerCount: number;
  watcherCount: number;
  weeklyGrowth: number;          // Percentage
  topContributors: string[];     // User IDs
}

/**
 * DTOs for tag operations
 */
export interface CreateTagData {
  name: string;
  displayName: string;
  description: string;
  category?: string;
  color?: string;
  icon?: string;
}

export interface UpdateTagData {
  displayName?: string;
  description?: string;
  category?: string;
  color?: string;
  icon?: string;
}

/**
 * Filters for querying tags
 */
export interface TagFilters {
  search?: string;
  category?: string;
  minCount?: number;
  sortBy?: 'count' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}

/**
 * Tag with populated data
 */
export interface TagWithDetails extends Tag {
  stats?: TagStats;
  isWatched?: boolean;           // For current user
}
