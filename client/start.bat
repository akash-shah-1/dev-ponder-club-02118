@echo off
echo Starting DevOverflow Full Stack Application...
echo.

echo Starting Backend Server...
start "Backend" cmd /k "cd backend && npm run start:dev"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:3001/api/docs
echo.
pause