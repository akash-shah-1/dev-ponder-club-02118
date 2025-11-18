#!/bin/bash

echo "🚀 Deploying DevOverflow to Vercel"
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "📦 Deploying Frontend..."
cd client
vercel --prod
FRONTEND_URL=$(vercel ls --prod | grep -o 'https://[^ ]*' | head -1)
echo "✅ Frontend deployed to: $FRONTEND_URL"
cd ..

echo ""
echo "🔧 Deploying Backend..."
cd server
vercel --prod
BACKEND_URL=$(vercel ls --prod | grep -o 'https://[^ ]*' | head -1)
echo "✅ Backend deployed to: $BACKEND_URL"
cd ..

echo ""
echo "🎉 Deployment Complete!"
echo ""
echo "Frontend: $FRONTEND_URL"
echo "Backend: $BACKEND_URL"
echo ""
echo "⚠️  Don't forget to:"
echo "1. Update VITE_API_URL in frontend environment variables to: $BACKEND_URL"
echo "2. Update CORS origins in backend to include: $FRONTEND_URL"
echo "3. Run database migrations: cd server && vercel env pull && npx prisma migrate deploy"
