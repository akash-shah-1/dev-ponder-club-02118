/**
 * Save/Bookmark-related types
 * Represents: saved_items table
 */

export type SavedItemType = 'question' | 'answer' | 'tag' | 'article' | 'discussion';

/**
 * Saved item entity (saved_items table)
 */
export interface SavedItem {
  id: string;                    // Primary key
  userId: string;                // Foreign key -> users.id, Index
  itemType: SavedItemType;       // Index
  itemId: string;                // ID of the saved item, Index
  savedAt: string;               // Timestamp
  notes?: string;                // User's private notes
  folder?: string;               // Organization folder
}

/**
 * DTOs for save operations
 */
export interface CreateSaveData {
  userId: string;
  itemType: SavedItemType;
  itemId: string;
  notes?: string;
  folder?: string;
}

export interface UpdateSaveData {
  notes?: string;
  folder?: string;
}

/**
 * Filters for querying saved items
 */
export interface SavedItemFilters {
  userId: string;                // Required
  itemType?: SavedItemType;
  folder?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'savedAt';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Saved item with populated data
 */
export interface SavedItemWithDetails extends SavedItem {
  item?: any;                    // The actual question/answer/etc object
  title?: string;                // Populated title for display
  preview?: string;              // Short preview text
}

/**
 * Save folders for organization
 */
export interface SaveFolder {
  name: string;
  userId: string;
  itemCount: number;
  createdAt: string;
}
