/**
 * Knowledge article-related types
 * Represents: knowledge_articles, article_sections tables
 */

export type ArticleCategory = 'tutorial' | 'guide' | 'reference' | 'faq' | 'best-practices';
export type ArticleStatus = 'draft' | 'published' | 'archived';

/**
 * Main Knowledge Article entity (knowledge_articles table)
 */
export interface KnowledgeArticle {
  id: string;                    // Primary key
  title: string;                 // Index
  slug: string;                  // Unique index
  description: string;           // SEO description
  content: string;               // Full article content (Markdown)
  category: ArticleCategory;     // Index
  status: ArticleStatus;         // Default: 'draft', Index
  authorId: string;              // Foreign key -> users.id
  author: any;
  createdAt: string;             // Timestamp, Index
  updatedAt: string;             // Timestamp
  publishedAt?: string;          // Timestamp
  views: number;                 // Default: 0, Index
  upvotes: number;               // Default: 0
  tags: string[];
  readTime: number;              // Estimated minutes
  tableOfContents?: ArticleSection[];
  featuredImage?: string;
  seoKeywords?: string[];
  relatedArticles?: string[];    // Article IDs
}

/**
 * Article section for table of contents (article_sections table)
 */
export interface ArticleSection {
  id: string;                    // Primary key
  articleId: string;             // Foreign key -> knowledge_articles.id
  title: string;
  anchor: string;                // URL anchor (#section-name)
  level: number;                 // Heading level (1-6)
  order: number;                 // Display order
}

/**
 * DTOs for knowledge article operations
 */
export interface CreateArticleData {
  title: string;
  slug: string;
  description: string;
  content: string;
  category: ArticleCategory;
  authorId: string;
  tags?: string[];
  featuredImage?: string;
  seoKeywords?: string[];
}

export interface UpdateArticleData {
  title?: string;
  slug?: string;
  description?: string;
  content?: string;
  category?: ArticleCategory;
  status?: ArticleStatus;
  tags?: string[];
  featuredImage?: string;
  seoKeywords?: string[];
}

/**
 * Filters for querying articles
 */
export interface ArticleFilters {
  category?: ArticleCategory;
  status?: ArticleStatus;
  authorId?: string;
  search?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'createdAt' | 'views' | 'upvotes' | 'readTime';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

/**
 * Article with analytics
 */
export interface ArticleWithStats extends KnowledgeArticle {
  viewsThisWeek: number;
  viewsThisMonth: number;
  averageRating: number;
  completionRate: number;        // Percentage of users who read to end
}
