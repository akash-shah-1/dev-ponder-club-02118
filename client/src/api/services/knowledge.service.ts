import { KnowledgeArticle, CreateArticleData, UpdateArticleData, ArticleFilters } from '../types';
import { apiClient } from '@/lib/api';

export const knowledgeService = {
  async getAll(filters?: ArticleFilters): Promise<KnowledgeArticle[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    
    const query = params.toString();
    return apiClient.get<KnowledgeArticle[]>(`/knowledge${query ? `?${query}` : ''}`);
  },

  async getById(id: string): Promise<KnowledgeArticle | null> {
    return apiClient.get<KnowledgeArticle>(`/knowledge/${id}`);
  },

  async create(data: CreateArticleData): Promise<KnowledgeArticle> {
    return apiClient.post<KnowledgeArticle>('/knowledge', data);
  },

  async update(id: string, data: UpdateArticleData): Promise<KnowledgeArticle> {
    return apiClient.patch<KnowledgeArticle>(`/knowledge/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/knowledge/${id}`);
  },

  async getByCategory(category: string): Promise<KnowledgeArticle[]> {
    return apiClient.get<KnowledgeArticle[]>(`/knowledge/category/${category}`);
  },

  async searchArticles(query: string): Promise<KnowledgeArticle[]> {
    return apiClient.get<KnowledgeArticle[]>(`/knowledge?search=${encodeURIComponent(query)}`);
  },

  async getMostViewed(limit: number = 10): Promise<KnowledgeArticle[]> {
    return apiClient.get<KnowledgeArticle[]>(`/knowledge/most-viewed?limit=${limit}`);
  },
};
