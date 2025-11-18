# DevOverflow 🚀

A modern Stack Overflow clone with AI-powered features, voice chat, and mobile support.

## ✨ Features

- 🤖 **AI-Powered Q&A** - Get instant answers using Google Gemini AI
- 🎤 **Voice Chat** - Talk to AI using Vapi voice integration
- 📱 **Mobile Apps** - Native Android & iOS apps with Capacitor
- 👥 **User Authentication** - Secure auth with Clerk
- 💬 **Real-time Discussions** - Community discussions and comments
- 📚 **Knowledge Base** - Curated articles and tutorials
- 🏆 **Gamification** - Reputation system and badges
- 🔍 **Advanced Search** - Vector-based semantic search
- 🎨 **Dark Mode** - Beautiful UI with light/dark themes
- 👨‍💼 **Admin Panel** - Manage users and content with AI chatbot

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for blazing fast builds
- **TailwindCSS** + **shadcn/ui** for beautiful UI
- **React Query** for data fetching
- **Capacitor** for mobile apps
- **Vapi** for voice AI

### Backend
- **NestJS** with TypeScript
- **PostgreSQL** with Prisma ORM
- **Redis** for caching
- **Google Gemini AI** for AI features
- **Clerk** for authentication
- **JWT** for admin auth

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **PostgreSQL** database (we recommend [Neon](https://neon.tech))
- **Redis** (optional, for caching)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/devoverflow.git
cd devoverflow
```

### 2. Install Dependencies

```bash
npm run setup:install
```

This will install dependencies for both client and server.

### 3. Set Up Environment Variables

#### Option A: Interactive Setup (Recommended)
```bash
npm run setup:env
```

#### Option B: Manual Setup

Create `.env` files manually:

**server/.env:**
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
CLERK_SECRET_KEY="sk_test_..."
CLERK_PUBLISHABLE_KEY="pk_test_..."
GEMINI_API_KEY="AIza..."
JWT_SECRET="your-secret-key"
ADMIN_USER_EMAIL="admin@example.com"
ADMIN_USER_PASSWORD="admin123"
PORT=3001
```

**client/.env.local:**
```env
VITE_CLERK_PUBLISHABLE_KEY="pk_test_..."
VITE_API_URL="http://localhost:3001"
VITE_VAPI_PUBLIC_KEY="pk_..." # Optional
```

### 4. Set Up Database

```bash
npm run setup:db
```

This will:
- Generate Prisma client
- Push schema to database
- Seed initial data (including admin user)

### 5. Start Development Servers

```bash
npm run dev
```

This starts both:
- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:5173

## 📱 Mobile Development

### Setup Capacitor

```bash
cd client
npm install
npx cap add android  # For Android
npx cap add ios      # For iOS (macOS only)
```

### Build and Sync

```bash
npm run build:mobile
```

### Open in IDE

```bash
npm run mobile:android  # Opens Android Studio
npm run mobile:ios      # Opens Xcode (macOS only)
```

## 🔑 Getting API Keys

### Required Keys

1. **Clerk** (Authentication)
   - Sign up at [clerk.com](https://clerk.com)
   - Create a new application
   - Copy API keys from dashboard

2. **Neon** (Database)
   - Sign up at [neon.tech](https://neon.tech)
   - Create a new project
   - Copy connection string

3. **Google Gemini** (AI)
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create API key

### Optional Keys

4. **Vapi** (Voice AI)
   - Sign up at [vapi.ai](https://vapi.ai)
   - Get public key from dashboard

5. **Redis** (Caching)
   - Use local Redis or [Redis Cloud](https://redis.com/try-free/)

## 📚 Available Scripts

### Root Level

```bash
npm run setup          # Complete setup (install + env + db)
npm run dev            # Start both client and server
npm run build          # Build both for production
npm run build:mobile   # Build and sync mobile apps
npm run db:studio      # Open Prisma Studio
npm run db:migrate     # Run database migrations
npm run db:seed        # Seed database
```

### Server Only

```bash
cd server
npm run start:dev      # Development mode
npm run build          # Build for production
npm run start:prod     # Start production server
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database
```

### Client Only

```bash
cd client
npm run dev            # Development mode
npm run build          # Build for production
npm run preview        # Preview production build
```

## 🏗️ Project Structure

```
devoverflow/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── hooks/         # Custom hooks
│   │   ├── api/           # API client
│   │   └── admin/         # Admin panel
│   ├── android/           # Android app
│   └── ios/               # iOS app
├── server/                # NestJS backend
│   ├── src/
│   │   ├── auth/          # Authentication
│   │   ├── questions/     # Questions module
│   │   ├── answers/       # Answers module
│   │   ├── ai/            # AI services
│   │   ├── admin/         # Admin features
│   │   └── prisma/        # Database
│   └── prisma/
│       ├── schema.prisma  # Database schema
│       └── seed.ts        # Seed data
└── scripts/               # Setup scripts
```

## 🔐 Admin Access

After setup, you can access the admin panel:

1. Go to http://localhost:5173/admin/login
2. Use credentials from `.env`:
   - Email: `ADMIN_USER_EMAIL`
   - Password: `ADMIN_USER_PASSWORD`

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check if database is accessible
cd server
npx prisma db pull

# Regenerate Prisma client
npx prisma generate
```

### Port Already in Use

```bash
# Kill process on port 3001 (server)
npx kill-port 3001

# Kill process on port 5173 (client)
npx kill-port 5173
```

### Prisma Client Out of Sync

```bash
cd server
rm -rf node_modules/.prisma
npx prisma generate
```

### CrewAI Directory Error (Windows)

```powershell
New-Item -ItemType Directory -Force -Path "$env:LOCALAPPDATA\CrewAI"
```

## 📖 Documentation

- [Server API Documentation](http://localhost:3001/api/docs) - Swagger UI
- [Prisma Studio](http://localhost:5555) - Database GUI
- [Setup Guide](./docs/SETUP.md) - Detailed setup instructions
- [Mobile Guide](./docs/MOBILE.md) - Mobile development guide
- [Deployment Guide](./docs/DEPLOYMENT.md) - Production deployment

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) first.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/)
- [React](https://react.dev/)
- [Prisma](https://www.prisma.io/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Capacitor](https://capacitorjs.com/)
- [Vapi](https://vapi.ai/)

## 📧 Support

For support, email support@devoverflow.com or join our [Discord](https://discord.gg/devoverflow).

---

Made with ❤️ by the DevOverflow Team
