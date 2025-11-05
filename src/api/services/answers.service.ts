import { Answer, Comment, CreateAnswerData, UpdateAnswerData, CreateCommentData, AnswerFilters } from '../types';
import { mockAnswers, mockComments } from '../mock';

const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const answersService = {
  async getAll(questionId?: string): Promise<Answer[]> {
    await delay();
    if (questionId) {
      return mockAnswers.filter(a => a.questionId === questionId);
    }
    return mockAnswers;
  },

  async getById(id: string): Promise<Answer | null> {
    await delay();
    return mockAnswers.find(a => a.id === id) || null;
  },

  async create(data: CreateAnswerData): Promise<Answer> {
    await delay();
    const newAnswer: Answer = {
      id: Date.now().toString(),
      ...data,
      author: { id: data.authorId, name: 'Current User', reputation: 0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      isAccepted: false,
      commentCount: 0,
    };
    return newAnswer;
  },

  async update(id: string, data: UpdateAnswerData): Promise<Answer> {
    await delay();
    const answer = mockAnswers.find(a => a.id === id);
    if (!answer) throw new Error('Answer not found');
    return { ...answer, ...data, updatedAt: new Date().toISOString() };
  },

  async delete(id: string): Promise<void> {
    await delay();
  },

  async acceptAnswer(id: string): Promise<Answer> {
    await delay();
    const answer = mockAnswers.find(a => a.id === id);
    if (!answer) throw new Error('Answer not found');
    return { ...answer, isAccepted: true };
  },

  async getByUser(userId: string): Promise<Answer[]> {
    await delay();
    return mockAnswers.filter(a => a.authorId === userId);
  },

  async addComment(answerId: string, data: CreateCommentData): Promise<Comment> {
    await delay();
    const newComment: Comment = {
      id: Date.now().toString(),
      answerId,
      content: data.content,
      authorId: data.authorId,
      author: { id: data.authorId, name: 'Current User' },
      createdAt: new Date().toISOString(),
      upvotes: 0,
    };
    return newComment;
  },

  async getComments(answerId: string): Promise<Comment[]> {
    await delay();
    return mockComments.filter(c => c.answerId === answerId);
  },
};
