/**
 * Notification-related types
 * Represents: notifications table
 */

export type NotificationType = 
  | 'answer'              // Someone answered your question
  | 'comment'             // Comment on your answer
  | 'upvote'              // Your content was upvoted
  | 'accepted'            // Your answer was accepted
  | 'mention'             // You were mentioned
  | 'badge'               // New badge earned
  | 'follow'              // Someone followed you
  | 'system';             // System notification

/**
 * Main Notification entity (notifications table)
 */
export interface Notification {
  id: string;                    // Primary key
  userId: string;                // Foreign key -> users.id, Index
  type: NotificationType;        // Index
  title: string;
  message: string;
  read: boolean;                 // Default: false, Index
  createdAt: string;             // Timestamp, Index
  actionUrl?: string;            // Link to related content
  actorId?: string;              // Foreign key -> users.id (who triggered it)
  actor?: any;
  metadata?: {                   // JSON field for additional data
    questionId?: string;
    answerId?: string;
    badgeId?: string;
    [key: string]: any;
  };
}

/**
 * DTOs for notification operations
 */
export interface CreateNotificationData {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  actorId?: string;
  metadata?: any;
}

/**
 * Filters for querying notifications
 */
export interface NotificationFilters {
  userId: string;                // Required
  type?: NotificationType;
  read?: boolean;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

/**
 * Notification preferences (user_notification_settings table)
 */
export interface NotificationSettings {
  userId: string;                // Foreign key -> users.id
  emailOnAnswer: boolean;        // Default: true
  emailOnComment: boolean;       // Default: true
  emailOnUpvote: boolean;        // Default: false
  emailOnAccepted: boolean;      // Default: true
  emailOnMention: boolean;       // Default: true
  emailOnBadge: boolean;         // Default: true
  emailOnFollow: boolean;        // Default: false
  pushNotifications: boolean;    // Default: false
}
