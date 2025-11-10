@echo off
REM Batch script to start both backend and frontend servers
REM This is a simpler alternative to the PowerShell script

echo ========================================
echo   DRN Development Server Starter
echo ========================================
echo.

echo Starting backend server on port 3001...
start "DRN Backend" cmd /k "cd backend && npm start"

timeout /t 2 /nobreak >nul

echo Starting frontend server on port 5173...
start "DRN Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   Servers are starting in separate windows
echo ========================================
echo   Backend:  http://localhost:3001
echo   Frontend: http://localhost:5173
echo.
echo   Close the server windows to stop the servers
echo.

pause

