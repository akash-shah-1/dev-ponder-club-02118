import { Discussion, DiscussionReply, CreateDiscussionData, UpdateDiscussionData, CreateDiscussionReplyData, DiscussionFilters } from '../types';
import { mockDiscussions } from '../mock';

const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const discussionsService = {
  async getAll(filters?: DiscussionFilters): Promise<Discussion[]> {
    await delay();
    let results = [...mockDiscussions];

    if (filters?.category) {
      results = results.filter(d => d.category === filters.category);
    }
    if (filters?.status) {
      results = results.filter(d => d.status === filters.status);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      results = results.filter(d =>
        d.title.toLowerCase().includes(search) ||
        d.content.toLowerCase().includes(search)
      );
    }

    return results;
  },

  async getById(id: string): Promise<Discussion | null> {
    await delay();
    return mockDiscussions.find(d => d.id === id) || null;
  },

  async create(data: CreateDiscussionData): Promise<Discussion> {
    await delay();
    const newDiscussion: Discussion = {
      id: Date.now().toString(),
      ...data,
      tags: data.tags || [],
      author: { id: data.authorId, name: 'Current User', reputation: 0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      upvotes: 0,
      replyCount: 0,
      isPinned: false,
      status: 'open',
    };
    return newDiscussion;
  },

  async update(id: string, data: UpdateDiscussionData): Promise<Discussion> {
    await delay();
    const discussion = mockDiscussions.find(d => d.id === id);
    if (!discussion) throw new Error('Discussion not found');
    return { ...discussion, ...data, updatedAt: new Date().toISOString() };
  },

  async delete(id: string): Promise<void> {
    await delay();
  },

  async getTrending(limit: number = 10): Promise<Discussion[]> {
    await delay();
    return [...mockDiscussions]
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  },

  async addReply(discussionId: string, data: CreateDiscussionReplyData): Promise<DiscussionReply> {
    await delay();
    const newReply: DiscussionReply = {
      id: Date.now().toString(),
      discussionId,
      content: data.content,
      authorId: data.authorId,
      author: { id: data.authorId, name: 'Current User', reputation: 0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      upvotes: 0,
      parentReplyId: data.parentReplyId,
    };
    return newReply;
  },

  async getReplies(discussionId: string): Promise<DiscussionReply[]> {
    await delay();
    return [];
  },
};
