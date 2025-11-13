#!/bin/bash

# AI Service Setup Script for Linux/Mac

echo "🤖 Setting up AI Service..."
echo ""

# Step 1: Generate Prisma Client
echo "📦 Step 1: Generating Prisma Client..."
npm run db:generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma client"
    exit 1
fi

echo "✅ Prisma client generated"
echo ""

# Step 2: Push Database Changes
echo "🗄️  Step 2: Pushing database schema..."
echo "⚠️  Make sure you've enabled pgvector in Neon:"
echo "   Run in Neon SQL Editor: CREATE EXTENSION IF NOT EXISTS vector;"
echo ""
read -p "Continue with db:push? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run db:push
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to push database schema"
        exit 1
    fi
    
    echo "✅ Database schema updated"
else
    echo "⏭️  Skipped database push"
fi

echo ""

# Step 3: Check Environment Variables
echo "🔐 Step 3: Checking environment variables..."

if [ -f .env ]; then
    if ! grep -q "OPENAI_API_KEY" .env; then
        echo "⚠️  OPENAI_API_KEY not found in .env"
        echo "   Add these to your .env file:"
        echo "   OPENAI_API_KEY=sk-your-key-here"
        echo "   OPENAI_MODEL=gpt-4-turbo-preview"
        echo "   (Optional for now - using mock responses)"
    else
        echo "✅ AI environment variables configured"
    fi
else
    echo "⚠️  .env file not found"
    echo "   Copy .env.example to .env and configure"
fi

echo ""

# Step 4: Summary
echo "🎉 AI Service Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "   1. Start the server: npm run start:dev"
echo "   2. Test AI endpoint: POST /ai/generate-answer/:questionId"
echo "   3. Check AI stats: GET /ai/stats"
echo ""
echo "📚 Documentation:"
echo "   - Read INSTALL_AI.md for detailed setup"
echo "   - Read AI_SERVICE_IMPLEMENTATION.md for integration guide"
echo ""
echo "🚀 The AI service is ready to use in MOCK mode!"
echo "   Add OPENAI_API_KEY to .env for production mode"
