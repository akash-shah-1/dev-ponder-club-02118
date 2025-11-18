# PowerShell script for Windows
Write-Host "🚀 Deploying DevOverFlow to Vercel" -ForegroundColor Green
Write-Host ""

# Check if vercel CLI is installed
if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

Write-Host "📦 Deploying Frontend..." -ForegroundColor Cyan
Set-Location client
vercel --prod
$FRONTEND_URL = (vercel ls --prod | Select-String -Pattern 'https://[^\s]+' | Select-Object -First 1).Matches.Value
Write-Host "✅ Frontend deployed to: $FRONTEND_URL" -ForegroundColor Green
Set-Location ..

Write-Host ""
Write-Host "🔧 Deploying Backend..." -ForegroundColor Cyan
Set-Location server
vercel --prod
$BACKEND_URL = (vercel ls --prod | Select-String -Pattern 'https://[^\s]+' | Select-Object -First 1).Matches.Value
Write-Host "✅ Backend deployed to: $BACKEND_URL" -ForegroundColor Green
Set-Location ..

Write-Host ""
Write-Host "🎉 Deployment Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: $FRONTEND_URL" -ForegroundColor Yellow
Write-Host "Backend: $BACKEND_URL" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  Don't forget to:" -ForegroundColor Yellow
Write-Host "1. Update VITE_API_URL in frontend environment variables to: $BACKEND_URL"
Write-Host "2. Update CORS origins in backend to include: $FRONTEND_URL"
Write-Host "3. Run database migrations: cd server; vercel env pull; npx prisma migrate deploy"
