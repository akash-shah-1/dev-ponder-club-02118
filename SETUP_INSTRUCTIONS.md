# DevOverflow - Setup Instructions 🚀

## For New Users / Contributors

### Quick Start (3 Steps)

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/devoverflow.git
cd devoverflow

# 2. Run automated setup
npm run setup

# 3. Start development servers
npm run dev
```

That's it! The app will be running at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- API Docs: http://localhost:3001/api/docs

---

## What `npm run setup` Does

The setup command automatically:

1. **Installs all dependencies** (client + server)
2. **Guides you through environment setup** (interactive)
3. **Sets up the database** (migrations + seed data)
4. **Creates admin user** (from your credentials)
5. **Generates Prisma client**

---

## Manual Setup (If Needed)

### Step 1: Install Dependencies

```bash
npm run setup:install
```

### Step 2: Configure Environment

#### Option A: Interactive (Recommended)
```bash
npm run setup:env
```

#### Option B: Manual

Create `server/.env`:
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

Create `client/.env.local`:
```env
VITE_CLERK_PUBLISHABLE_KEY="pk_test_..."
VITE_API_URL="http://localhost:3001"
VITE_VAPI_PUBLIC_KEY="pk_..."  # Optional
```

### Step 3: Setup Database

```bash
npm run setup:db
```

---

## Getting API Keys

### Required Keys

1. **Clerk** (Free)
   - Go to: https://clerk.com
   - Create account → New application
   - Copy: Secret Key & Publishable Key

2. **Neon Database** (Free)
   - Go to: https://neon.tech
   - Create account → New project
   - Copy: Connection String

3. **Google Gemini AI** (Free)
   - Go to: https://makersuite.google.com/app/apikey
   - Create API key
   - Copy: API Key

### Optional Keys

4. **Vapi Voice AI** (Free Trial)
   - Go to: https://vapi.ai
   - Create account
   - Copy: Public Key

---

## Development Commands

```bash
# Start both client and server
npm run dev

# Start only server
npm run dev:server

# Start only client
npm run dev:client

# Build for production
npm run build

# Open database GUI
npm run db:studio

# Run database migrations
npm run db:migrate
```

---

## Mobile Development

### Setup Android

```bash
cd client
npx cap add android
npm run build
npx cap sync
npx cap open android
```

### Setup iOS (macOS only)

```bash
cd client
npx cap add ios
npm run build
npx cap sync
npx cap open ios
```

### Build Mobile Apps

```bash
npm run build:mobile
```

---

## Troubleshooting

### "Cannot find module '@prisma/client'"

```bash
cd server
npx prisma generate
```

### "Port already in use"

```bash
npx kill-port 3001  # Kill server
npx kill-port 5173  # Kill client
```

### "Database connection failed"

- Check your DATABASE_URL in `server/.env`
- Ensure database is running
- Try: `cd server && npx prisma db pull`

### "Clerk authentication not working"

- Verify API keys are correct
- Check if using test keys (not live keys)
- Ensure both keys are from same Clerk application

---

## Project Structure

```
devoverflow/
├── client/              # React frontend
│   ├── src/
│   ├── android/         # Android app
│   └── ios/             # iOS app
├── server/              # NestJS backend
│   ├── src/
│   └── prisma/
├── scripts/             # Setup scripts
└── docs/                # Documentation
```

---

## Admin Access

After setup, access admin panel:

1. Go to: http://localhost:5173/admin/login
2. Use credentials from your `.env`:
   - Email: `ADMIN_USER_EMAIL`
   - Password: `ADMIN_USER_PASSWORD`

---

## Features Available

- ✅ User authentication (Clerk)
- ✅ Questions & Answers
- ✅ AI-powered responses (Gemini)
- ✅ Voice chat (Vapi)
- ✅ Discussions
- ✅ Knowledge base
- ✅ Admin panel
- ✅ Mobile apps (Capacitor)
- ✅ Dark mode
- ✅ Real-time notifications

---

## Need Help?

1. Check [README.md](./README.md) for detailed info
2. Check [docs/](./docs/) for guides
3. Open an issue on GitHub
4. Email: support@devoverflow.com

---

## Next Steps

1. ✅ Setup complete
2. 🎨 Customize the theme
3. 🚀 Add your features
4. 📱 Build mobile apps
5. 🌐 Deploy to production

---

Happy coding! 🎉
