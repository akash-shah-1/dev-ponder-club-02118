import { KnowledgeArticle, CreateArticleData, UpdateArticleData, ArticleFilters } from '../types';
import { mockKnowledgeArticles } from '../mock';

const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const knowledgeService = {
  async getAll(filters?: ArticleFilters): Promise<KnowledgeArticle[]> {
    await delay();
    let results = [...mockKnowledgeArticles];

    if (filters?.category) {
      results = results.filter(a => a.category === filters.category);
    }
    if (filters?.status) {
      results = results.filter(a => a.status === filters.status);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      results = results.filter(a =>
        a.title.toLowerCase().includes(search) ||
        a.description.toLowerCase().includes(search)
      );
    }

    return results;
  },

  async getById(id: string): Promise<KnowledgeArticle | null> {
    await delay();
    return mockKnowledgeArticles.find(a => a.id === id) || null;
  },

  async create(data: CreateArticleData): Promise<KnowledgeArticle> {
    await delay();
    const newArticle: KnowledgeArticle = {
      id: Date.now().toString(),
      ...data,
      tags: data.tags || [],
      author: { id: data.authorId, name: 'Current User' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      upvotes: 0,
      readTime: Math.ceil(data.content.split(' ').length / 200),
      status: 'draft',
    };
    return newArticle;
  },

  async update(id: string, data: UpdateArticleData): Promise<KnowledgeArticle> {
    await delay();
    const article = mockKnowledgeArticles.find(a => a.id === id);
    if (!article) throw new Error('Article not found');
    return { ...article, ...data, updatedAt: new Date().toISOString() };
  },

  async delete(id: string): Promise<void> {
    await delay();
  },

  async getByCategory(category: string): Promise<KnowledgeArticle[]> {
    await delay();
    return mockKnowledgeArticles.filter(a => a.category === category);
  },

  async searchArticles(query: string): Promise<KnowledgeArticle[]> {
    await delay();
    const search = query.toLowerCase();
    return mockKnowledgeArticles.filter(a =>
      a.title.toLowerCase().includes(search) ||
      a.content.toLowerCase().includes(search)
    );
  },

  async getMostViewed(limit: number = 10): Promise<KnowledgeArticle[]> {
    await delay();
    return [...mockKnowledgeArticles]
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  },
};
