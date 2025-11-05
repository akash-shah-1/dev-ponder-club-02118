import { SavedItem, CreateSaveData, UpdateSaveData, SavedItemFilters } from '../types';

const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const savesService = {
  async getSavedQuestions(userId: string): Promise<SavedItem[]> {
    await delay();
    return [];
  },

  async getSavedAnswers(userId: string): Promise<SavedItem[]> {
    await delay();
    return [];
  },

  async getSavedTags(userId: string): Promise<SavedItem[]> {
    await delay();
    return [];
  },

  async saveQuestion(userId: string, questionId: string): Promise<SavedItem> {
    await delay();
    const newSave: SavedItem = {
      id: Date.now().toString(),
      userId,
      itemType: 'question',
      itemId: questionId,
      savedAt: new Date().toISOString(),
    };
    return newSave;
  },

  async saveAnswer(userId: string, answerId: string): Promise<SavedItem> {
    await delay();
    const newSave: SavedItem = {
      id: Date.now().toString(),
      userId,
      itemType: 'answer',
      itemId: answerId,
      savedAt: new Date().toISOString(),
    };
    return newSave;
  },

  async saveTag(userId: string, tagId: string): Promise<SavedItem> {
    await delay();
    const newSave: SavedItem = {
      id: Date.now().toString(),
      userId,
      itemType: 'tag',
      itemId: tagId,
      savedAt: new Date().toISOString(),
    };
    return newSave;
  },

  async unsaveQuestion(userId: string, questionId: string): Promise<void> {
    await delay();
  },

  async unsaveAnswer(userId: string, answerId: string): Promise<void> {
    await delay();
  },

  async unsaveTag(userId: string, tagId: string): Promise<void> {
    await delay();
  },

  async getAll(filters: SavedItemFilters): Promise<SavedItem[]> {
    await delay();
    return [];
  },
};
