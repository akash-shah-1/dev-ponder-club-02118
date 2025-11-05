import { Collective, CollectiveMember, CreateCollectiveData, UpdateCollectiveData, CollectiveFilters } from '../types';
import { mockCollectives } from '../mock';

const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const collectivesService = {
  async getAll(filters?: CollectiveFilters): Promise<Collective[]> {
    await delay();
    let results = [...mockCollectives];

    if (filters?.type) {
      results = results.filter(c => c.type === filters.type);
    }
    if (filters?.category) {
      results = results.filter(c => c.category === filters.category);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      results = results.filter(c =>
        c.name.toLowerCase().includes(search) ||
        c.description.toLowerCase().includes(search)
      );
    }

    return results;
  },

  async getById(id: string): Promise<Collective | null> {
    await delay();
    return mockCollectives.find(c => c.id === id) || null;
  },

  async create(data: CreateCollectiveData): Promise<Collective> {
    await delay();
    const newCollective: Collective = {
      id: Date.now().toString(),
      ...data,
      tags: data.tags || [],
      memberCount: 1,
      questionCount: 0,
      createdAt: new Date().toISOString(),
      isOfficial: false,
      isActive: true,
    };
    return newCollective;
  },

  async update(id: string, data: UpdateCollectiveData): Promise<Collective> {
    await delay();
    const collective = mockCollectives.find(c => c.id === id);
    if (!collective) throw new Error('Collective not found');
    return { ...collective, ...data };
  },

  async delete(id: string): Promise<void> {
    await delay();
  },

  async searchCollectives(query: string): Promise<Collective[]> {
    await delay();
    const search = query.toLowerCase();
    return mockCollectives.filter(c =>
      c.name.toLowerCase().includes(search) ||
      c.description.toLowerCase().includes(search)
    );
  },

  async joinCollective(userId: string, collectiveId: string): Promise<void> {
    await delay();
  },

  async leaveCollective(userId: string, collectiveId: string): Promise<void> {
    await delay();
  },

  async getMembers(collectiveId: string): Promise<CollectiveMember[]> {
    await delay();
    return [];
  },
};
