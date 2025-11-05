import { Answer, Comment } from '../types';
import { mockUsers } from './users.mock';

export const mockAnswers: Answer[] = [
  {
    id: 'a1',
    questionId: '1',
    content: 'The best approach is to use an axios interceptor to automatically refresh tokens when they expire. Here\'s why this works well:\n\n1. **Centralized Logic**: All token refresh logic is in one place\n2. **Automatic**: No need to check token expiry manually\n3. **Seamless UX**: Users don\'t notice the refresh happening\n\nImplementation steps:\n\n```javascript\napi.interceptors.response.use(\n  (response) => response,\n  async (error) => {\n    if (error.response?.status === 401) {\n      const newToken = await refreshToken();\n      error.config.headers.Authorization = `Bearer ${newToken}`;\n      return api.request(error.config);\n    }\n    return Promise.reject(error);\n  }\n);\n```\n\n**Important considerations:**\n- Store tokens in memory or httpOnly cookies\n- Implement a token refresh queue to avoid multiple refresh calls\n- Handle refresh token expiry with logout',
    authorId: '3',
    author: {
      id: mockUsers[2].id,
      name: mockUsers[2].name,
      avatar: mockUsers[2].avatar,
      reputation: mockUsers[2].reputation,
    },
    createdAt: '2024-03-01T11:00:00Z',
    updatedAt: '2024-03-01T11:00:00Z',
    upvotes: 12,
    downvotes: 0,
    isAccepted: true,
    commentCount: 2,
  },
  {
    id: 'a2',
    questionId: '3',
    content: 'I recommend using **async/await** with proper try-catch blocks. It\'s much cleaner and easier to reason about:\n\n```javascript\nasync function processData() {\n  try {\n    const user = await fetchUser();\n    const orders = await fetchOrders(user.id);\n    const result = await processOrders(orders);\n    return result;\n  } catch (error) {\n    // Handle specific errors\n    if (error instanceof NetworkError) {\n      // Retry logic\n    } else if (error instanceof ValidationError) {\n      // Validation error handling\n    }\n    throw error; // Re-throw if not handled\n  }\n}\n```\n\n**Best practices:**\n- Use specific error types\n- Implement retry logic for transient failures\n- Add timeout handling\n- Log errors appropriately',
    authorId: '1',
    author: {
      id: mockUsers[0].id,
      name: mockUsers[0].name,
      avatar: mockUsers[0].avatar,
      reputation: mockUsers[0].reputation,
    },
    createdAt: '2024-02-29T10:30:00Z',
    updatedAt: '2024-02-29T10:30:00Z',
    upvotes: 18,
    downvotes: 1,
    isAccepted: true,
    commentCount: 3,
  },
  {
    id: 'a3',
    questionId: '5',
    content: 'In Docker Compose, containers communicate using service names, not localhost. Update your frontend config:\n\n```yaml\n# docker-compose.yml\nservices:\n  frontend:\n    environment:\n      - API_URL=http://backend:3000\n  backend:\n    ports:\n      - "3000:3000"\n```\n\nThe key is using `backend` (service name) instead of `localhost` in your API calls.',
    authorId: '5',
    author: {
      id: mockUsers[4].id,
      name: mockUsers[4].name,
      avatar: mockUsers[4].avatar,
      reputation: mockUsers[4].reputation,
    },
    createdAt: '2024-02-27T11:15:00Z',
    updatedAt: '2024-02-27T11:15:00Z',
    upvotes: 15,
    downvotes: 0,
    isAccepted: true,
    commentCount: 1,
  },
];

export const mockComments: Comment[] = [
  {
    id: 'c1',
    answerId: 'a1',
    content: 'This is exactly what I needed! How do you handle the refresh token queue?',
    authorId: '1',
    author: {
      id: mockUsers[0].id,
      name: mockUsers[0].name,
      avatar: mockUsers[0].avatar,
    },
    createdAt: '2024-03-01T11:30:00Z',
    upvotes: 3,
  },
  {
    id: 'c2',
    answerId: 'a1',
    content: 'You can use a promise-based queue to ensure only one refresh happens at a time.',
    authorId: '3',
    author: {
      id: mockUsers[2].id,
      name: mockUsers[2].name,
      avatar: mockUsers[2].avatar,
    },
    createdAt: '2024-03-01T12:00:00Z',
    upvotes: 5,
  },
];
