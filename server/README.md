# DevOverflow Backend API

A complete Stack Overflow clone backend built with NestJS, Prisma, PostgreSQL, and Clerk authentication.

## Features

- 🔐 **Clerk Authentication** - Zero-config OAuth with Google, GitHub, Discord
- 📊 **Complete API** - Questions, Answers, Votes, Tags, Users, Notifications
- 🗄️ **PostgreSQL + Prisma** - Type-safe database with migrations
- 📚 **Swagger Documentation** - Auto-generated API docs
- 🚀 **Production Ready** - Rate limiting, validation, error handling

## Quick Start

### 1. Environment Setup

```bash
# Copy environment variables
cp .env.example .env

# Update .env with your values:
DATABASE_URL="postgresql://username:password@localhost:5432/devoverflow"
CLERK_SECRET_KEY="sk_test_your_clerk_secret_key"
CLERK_PUBLISHABLE_KEY="pk_test_your_clerk_publishable_key"
```

### 2. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed initial data
npm run db:seed
```

### 3. Start Development Server

```bash
npm run start:dev
```

The API will be available at:
- **Server**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs

## API Endpoints

### Authentication
- All protected routes require `Authorization: Bearer <clerk_token>`

### Questions
- `GET /questions` - Get all questions with filters
- `POST /questions` - Create question (auth required)
- `GET /questions/:id` - Get question details
- `PATCH /questions/:id` - Update question (auth required)
- `DELETE /questions/:id` - Delete question (auth required)

### Answers
- `GET /answers/question/:questionId` - Get answers for question
- `POST /answers` - Create answer (auth required)
- `PATCH /answers/:id/accept` - Accept answer (auth required)

### Votes
- `POST /votes` - Vote on question/answer (auth required)
- `GET /votes/:targetId/status` - Get vote status

### Tags
- `GET /tags` - Get all tags
- `GET /tags/popular` - Get popular tags
- `GET /tags/search?q=query` - Search tags

### Users
- `GET /users/me` - Get current user (auth required)
- `GET /users/top` - Get top users by reputation

## Database Schema

- **Users** - Synced from Clerk webhooks
- **Questions** - With tags, categories, voting
- **Answers** - With acceptance, voting
- **Tags** - Auto-created, usage tracking
- **Votes** - Polymorphic voting system
- **Notifications** - Real-time updates

## Development

```bash
# Watch mode
npm run start:dev

# Build
npm run build

# Production
npm run start:prod

# Database operations
npm run db:studio    # Open Prisma Studio
npm run db:migrate   # Create migration
npm run db:push      # Push schema changes
```

## Deployment

1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Deploy to your platform (Vercel, Railway, etc.)

## Clerk Integration

1. Create account at [clerk.com](https://clerk.com)
2. Create new application
3. Enable OAuth providers (Google, GitHub)
4. Copy API keys to `.env`
5. Set up webhooks for user sync

## Tech Stack

- **NestJS** - Node.js framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **Clerk** - Authentication
- **Swagger** - API documentation
- **TypeScript** - Type safety