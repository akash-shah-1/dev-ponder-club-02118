import { Tag, TagStats, CreateTagData, UpdateTagData, TagFilters } from '../types';
import { mockTags } from '../mock';

const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const tagsService = {
  async getAll(filters?: TagFilters): Promise<Tag[]> {
    await delay();
    let results = [...mockTags];

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      results = results.filter(t =>
        t.name.toLowerCase().includes(search) ||
        t.displayName.toLowerCase().includes(search)
      );
    }
    if (filters?.category) {
      results = results.filter(t => t.category === filters.category);
    }
    if (filters?.minCount) {
      results = results.filter(t => (t.count || 0) >= filters.minCount);
    }

    return results;
  },

  async getById(id: string): Promise<Tag | null> {
    await delay();
    return mockTags.find(t => t.id === id) || null;
  },

  async getTrending(limit: number = 10): Promise<Tag[]> {
    await delay();
    return [...mockTags]
      .sort((a, b) => (b.count || 0) - (a.count || 0))
      .slice(0, limit);
  },

  async searchTags(query: string): Promise<Tag[]> {
    await delay();
    const search = query.toLowerCase();
    return mockTags.filter(t =>
      t.name.toLowerCase().includes(search) ||
      t.displayName.toLowerCase().includes(search) ||
      t.description.toLowerCase().includes(search)
    );
  },

  async getQuestionsByTag(tag: string): Promise<string[]> {
    await delay();
    return [];
  },

  async watchTag(userId: string, tagId: string): Promise<void> {
    await delay();
  },

  async unwatchTag(userId: string, tagId: string): Promise<void> {
    await delay();
  },

  async getUserWatchedTags(userId: string): Promise<Tag[]> {
    await delay();
    return mockTags.slice(0, 3);
  },

  async create(data: CreateTagData): Promise<Tag> {
    await delay();
    const newTag: Tag = {
      id: Date.now().toString(),
      ...data,
      count: 0,
      createdAt: new Date().toISOString(),
    };
    return newTag;
  },

  async update(id: string, data: UpdateTagData): Promise<Tag> {
    await delay();
    const tag = mockTags.find(t => t.id === id);
    if (!tag) throw new Error('Tag not found');
    return { ...tag, ...data };
  },
};
