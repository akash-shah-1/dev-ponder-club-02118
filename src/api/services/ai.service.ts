import { Question } from '../types';

const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const aiService = {
  async findSimilarQuestions(query: string): Promise<Question[]> {
    await delay();
    return [];
  },

  async suggestQuestions(context: string): Promise<string[]> {
    await delay();
    return [
      'How to implement authentication in React?',
      'Best practices for API error handling',
      'Understanding async/await in JavaScript',
    ];
  },

  async analyzeQuestion(text: string): Promise<{ score: number; suggestions: string[] }> {
    await delay();
    return {
      score: 85,
      suggestions: [
        'Add more context about your environment',
        'Include code examples',
        'Specify the error message you\'re seeing',
      ],
    };
  },

  async generateAnswerDraft(question: Question): Promise<string> {
    await delay();
    return 'Here\'s a suggested approach to solve your problem...';
  },

  async getSuggestedTags(text: string): Promise<string[]> {
    await delay();
    return ['react', 'javascript', 'typescript'];
  },
};
