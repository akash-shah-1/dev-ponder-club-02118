# DevOverflow Server 🚀

NestJS backend API for DevOverflow with AI-powered features.

## 🛠️ Tech Stack

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **Prisma** - Next-generation ORM
- **PostgreSQL** - Relational database
- **Redis** - Caching layer
- **Google Gemini AI** - AI-powered answers
- **Clerk** - Authentication
- **JWT** - Admin authentication
- **Swagger** - API documentation

## 📋 Prerequisites

- Node.js >= 18.0.0
- PostgreSQL database
- Redis (optional)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create `.env` file:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# Authentication
CLERK_SECRET_KEY="sk_test_..."
CLERK_PUBLISHABLE_KEY="pk_test_..."
JWT_SECRET="your-super-secret-jwt-key"

# AI Service
GEMINI_API_KEY="AIza..."
GEMINI_MODEL="gemini-2.0-flash-exp"

# Admin User
ADMIN_USER_EMAIL="admin@example.com"
ADMIN_USER_PASSWORD="admin123"

# Server
PORT=3001

# Optional
REDIS_URL="redis://localhost:6379"
ELEVENLABS_API_KEY="sk_..."
```

### 3. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database (creates admin user)
npx prisma db seed
```

### 4. Start Development Server

```bash
npm run start:dev
```

Server will start at http://localhost:3001

## 📚 Available Scripts

```bash
npm run start:dev      # Development mode with hot reload
npm run build          # Build for production
npm run start:prod     # Start production server
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database
npm run db:migrate     # Create and run migrations
npm run db:studio      # Open Prisma Studio (database GUI)
```

## 📖 API Documentation

Once the server is running, visit:

- **Swagger UI**: http://localhost:3001/api/docs
- **OpenAPI JSON**: http://localhost:3001/api/docs-json

## 🏗️ Project Structure

```
server/
├── src/
│   ├── main.ts                 # Application entry point
│   ├── app.module.ts           # Root module
│   ├── auth/                   # User authentication
│   ├── admin-auth/             # Admin authentication
│   ├── users/                  # User management
│   ├── questions/              # Questions CRUD
│   ├── answers/                # Answers CRUD
│   ├── votes/                  # Voting system
│   ├── comments/               # Comments
│   ├── tags/                   # Tags management
│   ├── discussions/            # Discussions
│   ├── knowledge/              # Knowledge base
│   ├── ai/                     # AI services
│   │   ├── ai.service.ts       # Main AI service
│   │   ├── services/
│   │   │   ├── embedding.service.ts    # Vector embeddings
│   │   │   └── context.service.ts      # Context building
│   ├── admin/                  # Admin features
│   │   ├── admin.service.ts    # Admin service
│   │   └── agents/             # CrewAI agents
│   ├── notifications/          # Notifications
│   ├── saves/                  # Saved items
│   ├── follows/                # Follow system
│   ├── tag-watches/            # Tag watching
│   ├── webhooks/               # Webhook handlers
│   └── prisma/                 # Prisma service
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Seed data
└── test/                       # Tests
```

## 🗄️ Database Schema

### Main Models

- **User** - User accounts with authentication
- **Question** - Questions posted by users
- **Answer** - Answers to questions
- **Comment** - Comments on questions/answers
- **Vote** - Upvotes/downvotes
- **Tag** - Question tags
- **Discussion** - Community discussions
- **KnowledgeArticle** - Knowledge base articles
- **Notification** - User notifications
- **Save** - Saved questions
- **Follow** - User following
- **TagWatch** - Watched tags
- **AiAnswer** - AI-generated answers
- **AiEmbedding** - Vector embeddings for search

### Relationships

```
User
├── questions (1:N)
├── answers (1:N)
├── votes (1:N)
├── comments (1:N)
├── discussions (1:N)
├── saves (1:N)
├── followers (N:M)
└── following (N:M)

Question
├── author (N:1)
├── answers (1:N)
├── tags (N:M)
├── votes (1:N)
├── comments (1:N)
└── aiAnswer (1:1)
```

## 🤖 AI Features

### 1. AI-Powered Answers

```typescript
POST /ai/chat
{
  "question": "How do I use React hooks?"
}
```

### 2. Detailed AI Answers

```typescript
POST /ai/detailed-answer/:questionId
```

### 3. Question Summaries

```typescript
POST /ai/summary/:questionId
```

### 4. Vector Search

Uses pgvector extension for semantic search:
- Automatic embedding generation
- Similarity-based question matching
- Context-aware responses

## 👨‍💼 Admin Features

### Admin Authentication

```typescript
POST /admin-auth/login
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

Returns JWT token for admin access.

### Admin AI Chatbot

```typescript
POST /admin-ai/chat
Headers: { Authorization: "Bearer <token>" }
{
  "prompt": "Show me all users"
}
```

### Admin SQL Agent (CrewAI)

```typescript
POST /admin-ai/run-sql
Headers: { Authorization: "Bearer <token>" }
{
  "prompt": "Count questions by category",
  "password": "admin_password" // Required for write operations
}
```

## 🔐 Authentication

### User Authentication (Clerk)

Protected routes use `@UseGuards(AuthGuard)`:

```typescript
@UseGuards(AuthGuard)
@Get('profile')
async getProfile(@CurrentUser() user: User) {
  return user;
}
```

### Admin Authentication (JWT)

Protected admin routes use `@UseGuards(AdminAuthGuard)`:

```typescript
@UseGuards(AdminAuthGuard)
@Get('admin/users')
async getUsers() {
  return this.usersService.findAll();
}
```

## 🔍 Search & Filtering

### Questions

```typescript
GET /questions?sortBy=newest&category=javascript&search=react
```

Supported filters:
- `sortBy`: newest, active, unanswered, solved
- `category`: Filter by category
- `search`: Full-text search
- `tags`: Filter by tags

### Vector Search

```typescript
POST /ai/search
{
  "query": "How to optimize React performance",
  "limit": 10
}
```

## 📊 Database Migrations

### Create Migration

```bash
npx prisma migrate dev --name add_new_feature
```

### Apply Migrations

```bash
npx prisma migrate deploy
```

### Reset Database

```bash
npx prisma migrate reset
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🐛 Troubleshooting

### Prisma Client Out of Sync

```bash
rm -rf node_modules/.prisma
npx prisma generate
```

### Database Connection Issues

```bash
# Test connection
npx prisma db pull

# Check schema
npx prisma validate
```

### Port Already in Use

```bash
# Kill process on port 3001
npx kill-port 3001

# Or change PORT in .env
PORT=3002
```

### CrewAI Directory Error (Windows)

```powershell
New-Item -ItemType Directory -Force -Path "$env:LOCALAPPDATA\CrewAI"
```

## 📈 Performance

### Caching

Redis caching is implemented for:
- User profiles
- Question lists
- Tag data
- Search results

### Database Optimization

- Indexed fields for fast queries
- Connection pooling
- Query optimization with Prisma

### Rate Limiting

Throttling is enabled:
- 100 requests per minute per IP
- Configurable in `app.module.ts`

## 🔒 Security

- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - DDoS protection
- **Input Validation** - class-validator
- **SQL Injection** - Prisma ORM protection
- **XSS Protection** - Sanitized inputs

## 📝 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `CLERK_SECRET_KEY` | Yes | Clerk authentication secret |
| `CLERK_PUBLISHABLE_KEY` | Yes | Clerk publishable key |
| `GEMINI_API_KEY` | Yes | Google Gemini AI API key |
| `JWT_SECRET` | Yes | JWT signing secret |
| `ADMIN_USER_EMAIL` | Yes | Admin user email |
| `ADMIN_USER_PASSWORD` | Yes | Admin user password |
| `PORT` | No | Server port (default: 3001) |
| `REDIS_URL` | No | Redis connection string |
| `ELEVENLABS_API_KEY` | No | ElevenLabs TTS API key |

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start:prod
```

### Environment Setup

1. Set all required environment variables
2. Run database migrations
3. Seed initial data
4. Start server

### Recommended Platforms

- **Vercel** - Serverless deployment
- **Railway** - Full-stack deployment
- **Heroku** - Container deployment
- **AWS** - EC2 or ECS
- **DigitalOcean** - Droplets or App Platform

## 📧 Support

For issues or questions:
- Open an issue on GitHub
- Email: support@devoverflow.com
- Discord: https://discord.gg/devoverflow

---

Made with ❤️ by the DevOverflow Team
