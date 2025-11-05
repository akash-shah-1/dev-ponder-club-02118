import { Question, CreateQuestionData, QuestionFilters, UpdateQuestionData } from '../types';
import { mockQuestions } from '../mock';

const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const questionsService = {
  async getAll(filters?: QuestionFilters): Promise<Question[]> {
    await delay();
    let results = [...mockQuestions];
    
    if (filters?.category) {
      results = results.filter(q => q.category === filters.category);
    }
    if (filters?.tags?.length) {
      results = results.filter(q => 
        filters.tags!.some(tag => q.tags.includes(tag))
      );
    }
    if (filters?.solved !== undefined) {
      results = results.filter(q => q.solved === filters.solved);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      results = results.filter(q => 
        q.title.toLowerCase().includes(search) ||
        q.description.toLowerCase().includes(search)
      );
    }
    
    return results;
  },

  async getById(id: string): Promise<Question | null> {
    await delay();
    return mockQuestions.find(q => q.id === id) || null;
  },

  async create(data: CreateQuestionData): Promise<Question> {
    await delay();
    const newQuestion: Question = {
      id: Date.now().toString(),
      ...data,
      excerpt: data.description.substring(0, 150),
      author: { id: data.authorId, name: 'Current User', reputation: 0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      upvotes: 0,
      downvotes: 0,
      answerCount: 0,
      solved: false,
      status: 'open',
    };
    return newQuestion;
  },

  async update(id: string, data: UpdateQuestionData): Promise<Question> {
    await delay();
    const question = mockQuestions.find(q => q.id === id);
    if (!question) throw new Error('Question not found');
    return { ...question, ...data, updatedAt: new Date().toISOString() };
  },

  async delete(id: string): Promise<void> {
    await delay();
  },

  async searchQuestions(query: string): Promise<Question[]> {
    await delay();
    const search = query.toLowerCase();
    return mockQuestions.filter(q => 
      q.title.toLowerCase().includes(search) ||
      q.description.toLowerCase().includes(search) ||
      q.tags.some(tag => tag.toLowerCase().includes(search))
    );
  },

  async getByCategory(category: string): Promise<Question[]> {
    await delay();
    return mockQuestions.filter(q => q.category === category);
  },

  async getByTag(tag: string): Promise<Question[]> {
    await delay();
    return mockQuestions.filter(q => q.tags.includes(tag));
  },

  async getByUser(userId: string): Promise<Question[]> {
    await delay();
    return mockQuestions.filter(q => q.authorId === userId);
  },

  async getTrending(limit: number = 10): Promise<Question[]> {
    await delay();
    return mockQuestions
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  },

  async markAsSolved(id: string): Promise<Question> {
    await delay();
    const question = mockQuestions.find(q => q.id === id);
    if (!question) throw new Error('Question not found');
    return { ...question, solved: true, status: 'solved' };
  },

  async upvoteQuestion(id: string): Promise<void> {
    await delay();
  },
};
