# Deployment Guide 🚀

Complete guide for deploying DevOverflow to production.

## 📋 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] Admin user created
- [ ] API keys obtained and tested
- [ ] Build process tested locally
- [ ] Security review completed
- [ ] Performance testing done

## 🌐 Web Deployment

### Option 1: Vercel (Recommended for Frontend)

#### Deploy Frontend

```bash
cd client
npm install -g vercel
vercel
```

#### Configuration

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "VITE_CLERK_PUBLISHABLE_KEY": "@clerk-key",
    "VITE_API_URL": "@api-url",
    "VITE_VAPI_PUBLIC_KEY": "@vapi-key"
  }
}
```

Add environment variables in Vercel dashboard.

#### Deploy Backend

Vercel also supports Node.js:

```bash
cd server
vercel
```

Create `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/main.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/main.js"
    }
  ]
}
```

### Option 2: Railway

#### 1. Install Railway CLI

```bash
npm install -g @railway/cli
```

#### 2. Login

```bash
railway login
```

#### 3. Deploy Backend

```bash
cd server
railway init
railway up
```

#### 4. Add Environment Variables

```bash
railway variables set DATABASE_URL="postgresql://..."
railway variables set CLERK_SECRET_KEY="sk_..."
# ... add all variables
```

#### 5. Deploy Frontend

```bash
cd client
railway init
railway up
```

### Option 3: Heroku

#### Backend Deployment

```bash
cd server
heroku create devoverflow-api
heroku addons:create heroku-postgresql:hobby-dev
heroku addons:create heroku-redis:hobby-dev

# Set environment variables
heroku config:set CLERK_SECRET_KEY="sk_..."
heroku config:set GEMINI_API_KEY="AIza..."

# Deploy
git push heroku main

# Run migrations
heroku run npx prisma migrate deploy
heroku run npx prisma db seed
```

#### Frontend Deployment

```bash
cd client
heroku create devoverflow-web
heroku buildpacks:set heroku/nodejs

# Set environment variables
heroku config:set VITE_CLERK_PUBLISHABLE_KEY="pk_..."
heroku config:set VITE_API_URL="https://devoverflow-api.herokuapp.com"

# Deploy
git push heroku main
```

### Option 4: DigitalOcean App Platform

#### 1. Create App

- Go to DigitalOcean dashboard
- Click "Create" > "Apps"
- Connect your GitHub repository

#### 2. Configure Backend

```yaml
name: devoverflow-api
services:
  - name: api
    github:
      repo: yourusername/devoverflow
      branch: main
      deploy_on_push: true
    source_dir: /server
    build_command: npm run build
    run_command: npm run start:prod
    envs:
      - key: DATABASE_URL
        value: ${db.DATABASE_URL}
      - key: CLERK_SECRET_KEY
        value: ${CLERK_SECRET_KEY}
    http_port: 3001
databases:
  - name: db
    engine: PG
    version: "14"
```

#### 3. Configure Frontend

```yaml
name: devoverflow-web
services:
  - name: web
    github:
      repo: yourusername/devoverflow
      branch: main
      deploy_on_push: true
    source_dir: /client
    build_command: npm run build
    envs:
      - key: VITE_CLERK_PUBLISHABLE_KEY
        value: ${CLERK_PUBLISHABLE_KEY}
      - key: VITE_API_URL
        value: https://devoverflow-api.ondigitalocean.app
    http_port: 8080
    routes:
      - path: /
```

### Option 5: AWS

#### Backend (EC2)

```bash
# SSH into EC2 instance
ssh -i key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone https://github.com/yourusername/devoverflow.git
cd devoverflow/server

# Install dependencies
npm install

# Set up environment
cp .env.example .env
nano .env  # Edit with your values

# Build
npm run build

# Install PM2
sudo npm install -g pm2

# Start server
pm2 start dist/main.js --name devoverflow-api
pm2 startup
pm2 save
```

#### Frontend (S3 + CloudFront)

```bash
# Build
cd client
npm run build

# Install AWS CLI
pip install awscli

# Configure AWS
aws configure

# Create S3 bucket
aws s3 mb s3://devoverflow-web

# Upload files
aws s3 sync dist/ s3://devoverflow-web --delete

# Enable static website hosting
aws s3 website s3://devoverflow-web --index-document index.html

# Create CloudFront distribution
aws cloudfront create-distribution --origin-domain-name devoverflow-web.s3.amazonaws.com
```

## 📱 Mobile Deployment

### Android (Google Play Store)

#### 1. Prepare for Release

```bash
cd client
npm run build
npx cap sync android
```

#### 2. Generate Signing Key

```bash
keytool -genkey -v -keystore devoverflow-release.keystore -alias devoverflow -keyalg RSA -keysize 2048 -validity 10000
```

#### 3. Configure Signing

Edit `android/app/build.gradle`:

```gradle
android {
    signingConfigs {
        release {
            storeFile file('../../devoverflow-release.keystore')
            storePassword System.getenv("KEYSTORE_PASSWORD")
            keyAlias 'devoverflow'
            keyPassword System.getenv("KEY_PASSWORD")
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

#### 4. Build Release APK/AAB

```bash
cd android
./gradlew bundleRelease  # For AAB (recommended)
# OR
./gradlew assembleRelease  # For APK
```

Output:
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`
- APK: `android/app/build/outputs/apk/release/app-release.apk`

#### 5. Upload to Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app
3. Fill in app details
4. Upload AAB file
5. Complete store listing
6. Submit for review

### iOS (App Store)

#### 1. Prepare for Release

```bash
cd client
npm run build
npx cap sync ios
```

#### 2. Open in Xcode

```bash
npx cap open ios
```

#### 3. Configure Signing

1. Select project in Xcode
2. Go to "Signing & Capabilities"
3. Select your team
4. Enable "Automatically manage signing"

#### 4. Archive

1. Product > Archive
2. Wait for archive to complete
3. Click "Distribute App"
4. Select "App Store Connect"
5. Follow wizard

#### 5. Submit to App Store

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Create new app
3. Fill in app information
4. Upload build from Xcode
5. Submit for review

## 🗄️ Database Deployment

### Neon (Recommended)

```bash
# Already set up in DATABASE_URL
# Neon handles backups and scaling automatically
```

### Self-Hosted PostgreSQL

```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb devoverflow

# Create user
sudo -u postgres createuser devoverflow_user

# Grant privileges
sudo -u postgres psql
GRANT ALL PRIVILEGES ON DATABASE devoverflow TO devoverflow_user;

# Update DATABASE_URL
DATABASE_URL="postgresql://devoverflow_user:password@localhost:5432/devoverflow"
```

### Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Get connection string
3. Update DATABASE_URL
4. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

## 🔐 Environment Variables

### Production Environment Variables

#### Backend

```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
CLERK_SECRET_KEY="sk_live_..."
CLERK_PUBLISHABLE_KEY="pk_live_..."
JWT_SECRET="super-secret-production-key"

# AI
GEMINI_API_KEY="AIza..."
GEMINI_MODEL="gemini-2.0-flash-exp"

# Admin
ADMIN_USER_EMAIL="admin@yourdomain.com"
ADMIN_USER_PASSWORD="strong-password-here"

# Server
PORT=3001
NODE_ENV="production"

# Optional
REDIS_URL="redis://..."
ELEVENLABS_API_KEY="sk_..."
```

#### Frontend

```env
VITE_CLERK_PUBLISHABLE_KEY="pk_live_..."
VITE_API_URL="https://api.yourdomain.com"
VITE_VAPI_PUBLIC_KEY="pk_..."
```

## 🔒 Security Checklist

- [ ] Use HTTPS everywhere
- [ ] Enable CORS with specific origins
- [ ] Set secure JWT secret (32+ characters)
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Set up database backups
- [ ] Enable database SSL
- [ ] Use strong admin passwords
- [ ] Enable Helmet.js security headers
- [ ] Sanitize user inputs
- [ ] Keep dependencies updated
- [ ] Set up monitoring and alerts

## 📊 Monitoring

### Sentry (Error Tracking)

```bash
npm install @sentry/node @sentry/react
```

#### Backend

```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

#### Frontend

```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
});
```

### LogRocket (Session Replay)

```bash
npm install logrocket
```

```typescript
import LogRocket from 'logrocket';

LogRocket.init('your-app-id');
```

## 🚀 CI/CD

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd server && npm install
      - name: Build
        run: cd server && npm run build
      - name: Deploy to Railway
        run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd client && npm install
      - name: Build
        run: cd client && npm run build
      - name: Deploy to Vercel
        run: vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

## 🔄 Database Migrations

### Production Migrations

```bash
# Never use migrate dev in production!
# Use migrate deploy instead

cd server
npx prisma migrate deploy
```

### Backup Before Migration

```bash
# PostgreSQL backup
pg_dump -U username -d database_name > backup.sql

# Restore if needed
psql -U username -d database_name < backup.sql
```

## 📈 Performance Optimization

### Backend

- Enable Redis caching
- Use connection pooling
- Optimize database queries
- Enable compression
- Use CDN for static assets

### Frontend

- Enable code splitting
- Optimize images
- Use lazy loading
- Enable service worker
- Minimize bundle size

## 🐛 Troubleshooting

### Build Failures

```bash
# Clear caches
rm -rf node_modules dist .next
npm install
npm run build
```

### Database Connection Issues

```bash
# Test connection
npx prisma db pull

# Check SSL requirements
DATABASE_URL="postgresql://...?sslmode=require"
```

### Mobile Build Issues

```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
npx cap sync
```

## 📧 Support

For deployment issues:
- Check logs in your hosting platform
- Review error messages carefully
- Consult platform-specific documentation
- Contact support@devoverflow.com

---

Made with ❤️ by the DevOverflow Team
