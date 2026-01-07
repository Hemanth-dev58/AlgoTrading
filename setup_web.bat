@echo off
REM AlgoTrading Web Frontend Setup and Run Script (Windows)
REM This script sets up and runs the React web frontend

echo ==========================================
echo AlgoTrading Web Frontend Setup
echo ==========================================

REM Navigate to web directory
cd "%~dp0web"

REM Check Node.js
echo Checking Node.js version...
node --version
if errorlevel 1 (
    echo Error: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    (
        echo VITE_API_BASE_URL=http://localhost:8000/api
        echo VITE_WS_BASE_URL=ws://localhost:8000/api/ws
    ) > .env
    echo Created .env file with default settings
)

REM Install dependencies if node_modules doesn't exist
if not exist node_modules (
    echo Installing npm dependencies...
    call npm install
) else (
    echo Dependencies already installed (node_modules exists)
    echo Run 'npm install' manually if you need to update dependencies
)

echo.
echo ==========================================
echo Web frontend setup complete!
echo ==========================================
echo.
echo Starting development server...
echo Web app will be available at: http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo.

REM Run the development server
call npm run dev

pause
