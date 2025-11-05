/**
 * Company-related types
 * Represents: companies, company_followers tables
 */

/**
 * Main Company entity (companies table)
 */
export interface Company {
  id: string;                    // Primary key
  name: string;                  // Unique index
  slug: string;                  // Unique index
  logo: string;
  description: string;
  industry: string;              // Index
  size: CompanySize;
  website?: string;
  location?: string;
  foundedYear?: number;
  tags: string[];                // Technologies used
  followers: number;             // Default: 0
  questionsCount: number;        // Default: 0
  employeesCount?: number;
  createdAt: string;             // Timestamp
  updatedAt: string;             // Timestamp
  isVerified: boolean;           // Default: false
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export type CompanySize = 
  | '1-10'
  | '11-50'
  | '51-200'
  | '201-500'
  | '501-1000'
  | '1000+';

/**
 * Company follower relationship (company_followers table)
 */
export interface CompanyFollower {
  id: string;                    // Primary key
  companyId: string;             // Foreign key -> companies.id
  userId: string;                // Foreign key -> users.id
  createdAt: string;             // Timestamp
}

/**
 * DTOs for company operations
 */
export interface CreateCompanyData {
  name: string;
  slug: string;
  logo: string;
  description: string;
  industry: string;
  size: CompanySize;
  website?: string;
  location?: string;
  foundedYear?: number;
  tags?: string[];
}

export interface UpdateCompanyData {
  name?: string;
  slug?: string;
  logo?: string;
  description?: string;
  industry?: string;
  size?: CompanySize;
  website?: string;
  location?: string;
  foundedYear?: number;
  tags?: string[];
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

/**
 * Filters for querying companies
 */
export interface CompanyFilters {
  industry?: string;
  size?: CompanySize;
  location?: string;
  tags?: string[];
  search?: string;
  isVerified?: boolean;
  sortBy?: 'name' | 'followers' | 'questionsCount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

/**
 * Company with additional stats
 */
export interface CompanyWithStats extends Company {
  recentQuestions?: string[];    // Question IDs
  topContributors?: string[];    // User IDs
  isFollowedByUser?: boolean;    // For current user
}
