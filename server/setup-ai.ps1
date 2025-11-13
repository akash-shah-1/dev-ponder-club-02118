# AI Service Setup Script for Windows PowerShell

Write-Host "🤖 Setting up AI Service..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Generate Prisma Client
Write-Host "📦 Step 1: Generating Prisma Client..." -ForegroundColor Yellow
npm run db:generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Prisma client generated" -ForegroundColor Green
Write-Host ""

# Step 2: Push Database Changes
Write-Host "🗄️  Step 2: Pushing database schema..." -ForegroundColor Yellow
Write-Host "⚠️  Make sure you've enabled pgvector in Neon:" -ForegroundColor Magenta
Write-Host "   Run in Neon SQL Editor: CREATE EXTENSION IF NOT EXISTS vector;" -ForegroundColor White
Write-Host ""
$continue = Read-Host "Continue with db:push? (y/n)"

if ($continue -eq "y" -or $continue -eq "Y") {
    npm run db:push
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to push database schema" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Database schema updated" -ForegroundColor Green
} else {
    Write-Host "⏭️  Skipped database push" -ForegroundColor Yellow
}

Write-Host ""

# Step 3: Check Environment Variables
Write-Host "🔐 Step 3: Checking environment variables..." -ForegroundColor Yellow

if (Test-Path .env) {
    $envContent = Get-Content .env -Raw
    
    if ($envContent -notmatch "OPENAI_API_KEY") {
        Write-Host "⚠️  OPENAI_API_KEY not found in .env" -ForegroundColor Yellow
        Write-Host "   Add these to your .env file:" -ForegroundColor White
        Write-Host "   OPENAI_API_KEY=sk-your-key-here" -ForegroundColor Gray
        Write-Host "   OPENAI_MODEL=gpt-4-turbo-preview" -ForegroundColor Gray
        Write-Host "   (Optional for now - using mock responses)" -ForegroundColor Cyan
    } else {
        Write-Host "✅ AI environment variables configured" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  .env file not found" -ForegroundColor Yellow
    Write-Host "   Copy .env.example to .env and configure" -ForegroundColor White
}

Write-Host ""

# Step 4: Summary
Write-Host "🎉 AI Service Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Start the server: npm run start:dev" -ForegroundColor White
Write-Host "   2. Test AI endpoint: POST /ai/generate-answer/:questionId" -ForegroundColor White
Write-Host "   3. Check AI stats: GET /ai/stats" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   - Read INSTALL_AI.md for detailed setup" -ForegroundColor White
Write-Host "   - Read AI_SERVICE_IMPLEMENTATION.md for integration guide" -ForegroundColor White
Write-Host ""
Write-Host "🚀 The AI service is ready to use in MOCK mode!" -ForegroundColor Green
Write-Host "   Add OPENAI_API_KEY to .env for production mode" -ForegroundColor Yellow
