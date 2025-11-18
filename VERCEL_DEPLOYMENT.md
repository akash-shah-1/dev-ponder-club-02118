# Vercel Deployment Guide 🚀

Complete guide to deploy DevOverflow on Vercel.

## 📋 Prerequisites

- Vercel account (free tier available)
- GitHub repository
- All API keys ready

## 🌐 Deploy Frontend (Client)

### Option 1: Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click "Add New" → "Project"

2. **Import Repository**
   - Connect your GitHub account
   - Select your DevOverflow repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**
   
   Click "Environment Variables" and add:
   
   ```
   VITE_CLERK_PUBLISHABLE_KEY = pk_live_...
   VITE_API_URL = https://your-backend.vercel.app
   VITE_VAPI_PUBLIC_KEY = pk_... (optional)
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your frontend will be live at: `https://your-app.vercel.app`

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from client directory
cd client
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? devoverflow-client
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

## 🔧 Deploy Backend (Server)

### Option 1: Vercel Dashboard

1. **Create New Project**
   - Go to Vercel Dashboard
   - Click "Add New" → "Project"
   - Import same repository

2. **Configure Project**
   - **Framework Preset**: Other
   - **Root Directory**: `server`
   - **Build Command**: `npm run build && npx prisma generate`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Add Environment Variables**
   
   ```
   DATABASE_URL = postgresql://...
   CLERK_SECRET_KEY = sk_live_...
   CLERK_PUBLISHABLE_KEY = pk_live_...
   GEMINI_API_KEY = AIza...
   JWT_SECRET = your-production-secret
   ADMIN_USER_EMAIL = admin@yourdomain.com
   ADMIN_USER_PASSWORD = strong-password
   NODE_ENV = production
   ```

4. **Deploy**
   - Click "Deploy"
   - Note the deployment URL
   - Update frontend `VITE_API_URL` with this URL

### Option 2: Vercel CLI

```bash
# Deploy from server directory
cd server

# Build first
npm run build
npx prisma generate

# Deploy
vercel

# Deploy to production
vercel --prod
```

## ⚙️ Post-Deployment Setup

### 1. Run Database Migrations

```bash
# Install Vercel CLI if not already
npm install -g vercel

# Link to your project
cd server
vercel link

# Run migrations
vercel env pull .env.production
npx prisma migrate deploy
npx prisma db seed
```

### 2. Update Frontend API URL

After backend is deployed:

1. Go to frontend project in Vercel
2. Settings → Environment Variables
3. Update `VITE_API_URL` to your backend URL
4. Redeploy frontend

### 3. Configure CORS

Update `server/src/main.ts`:

```typescript
app.enableCors({
  origin: [
    'https://your-frontend.vercel.app',
    'http://localhost:5173', // For local development
  ],
  credentials: true,
});
```

Redeploy backend after this change.

## 🔄 Automatic Deployments

### Enable Auto-Deploy

Vercel automatically deploys when you push to GitHub:

- **Production**: Pushes to `main` branch
- **Preview**: Pushes to other branches

### Configure Branches

In Vercel Dashboard:
1. Go to Project Settings
2. Git → Production Branch
3. Set to `main`

## 🌍 Custom Domain

### Add Custom Domain

1. **In Vercel Dashboard**
   - Go to Project Settings
   - Domains → Add Domain
   - Enter your domain (e.g., `devoverflow.com`)

2. **Configure DNS**
   
   Add these records to your DNS provider:
   
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **Wait for Verification**
   - Usually takes 5-10 minutes
   - Vercel will auto-configure SSL

### Separate Domains for Frontend/Backend

**Frontend**: `devoverflow.com`
**Backend**: `api.devoverflow.com`

Configure both in their respective Vercel projects.

## 📊 Environment Variables Management

### Production Variables

```bash
# Set via CLI
vercel env add VARIABLE_NAME production

# Or via Dashboard
# Settings → Environment Variables → Add
```

### Pull Environment Variables

```bash
# Pull to local .env file
vercel env pull .env.production
```

## 🔍 Monitoring & Logs

### View Logs

```bash
# Real-time logs
vercel logs

# Or in Dashboard
# Deployments → Select deployment → Logs
```

### Analytics

Vercel provides:
- Page views
- Top pages
- Visitor locations
- Performance metrics

Access in: Dashboard → Analytics

## 🐛 Troubleshooting

### Build Fails

**Issue**: "Module not found"
```bash
# Ensure all dependencies are in package.json
npm install --save missing-package
git commit && git push
```

**Issue**: "Prisma client not generated"
```bash
# Update build command to:
npm run build && npx prisma generate
```

### Runtime Errors

**Issue**: "Cannot connect to database"
- Check DATABASE_URL in environment variables
- Ensure database allows connections from Vercel IPs
- For Neon: Enable "Allow connections from Vercel"

**Issue**: "CORS errors"
- Update CORS origins in `main.ts`
- Include your Vercel frontend URL
- Redeploy backend

### Serverless Function Timeout

Vercel has 10-second timeout on Hobby plan.

**Solution**: Upgrade to Pro plan or optimize long-running operations.

## 💰 Pricing

### Hobby Plan (Free)
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Preview deployments
- ⚠️ 10s function timeout
- ⚠️ 1 concurrent build

### Pro Plan ($20/month)
- ✅ Everything in Hobby
- ✅ 1TB bandwidth/month
- ✅ 60s function timeout
- ✅ 3 concurrent builds
- ✅ Team collaboration

## 🔐 Security Best Practices

1. **Use Environment Variables**
   - Never commit secrets to Git
   - Use Vercel's environment variables

2. **Enable HTTPS**
   - Automatic with Vercel
   - Force HTTPS redirects

3. **Set Security Headers**
   - Already configured in `vercel.json`
   - Includes CSP, XSS protection

4. **Rotate Secrets**
   - Change JWT_SECRET for production
   - Use different API keys than development

## 📈 Performance Optimization

### Frontend

1. **Enable Edge Network**
   - Automatic with Vercel
   - Global CDN distribution

2. **Image Optimization**
   ```typescript
   import Image from 'next/image'
   // Vercel automatically optimizes images
   ```

3. **Code Splitting**
   - Vite handles this automatically
   - Lazy load routes

### Backend

1. **Database Connection Pooling**
   ```typescript
   // In Prisma schema
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
     // Add connection pooling
     connection_limit = 10
   }
   ```

2. **Enable Caching**
   - Use Redis for caching
   - Cache API responses

## 🚀 Deployment Checklist

Before deploying:

- [ ] All environment variables configured
- [ ] Database migrations ready
- [ ] CORS configured correctly
- [ ] API keys are production keys (not test)
- [ ] Build succeeds locally
- [ ] Tests pass
- [ ] Security headers configured
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up

## 📝 Deployment Commands Summary

```bash
# Frontend
cd client
vercel --prod

# Backend
cd server
npm run build
npx prisma generate
vercel --prod

# Run migrations
vercel env pull .env.production
npx prisma migrate deploy
npx prisma db seed
```

## 🔗 Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Vercel Support](https://vercel.com/support)

## 📧 Support

If you encounter issues:
1. Check Vercel logs
2. Review build output
3. Check environment variables
4. Contact Vercel support

---

Your DevOverflow app is now live on Vercel! 🎉

**Frontend**: https://your-app.vercel.app
**Backend**: https://your-api.vercel.app
**Admin**: https://your-app.vercel.app/admin

Share it with the world! 🌍
