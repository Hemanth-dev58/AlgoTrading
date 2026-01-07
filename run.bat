@echo off
REM AlgoTrading Master Run Script (Windows)
REM This script runs both backend and frontend in separate windows

echo ==========================================
echo AlgoTrading - Full Stack Launcher
echo ==========================================
echo.

REM Get the script directory
set "SCRIPT_DIR=%~dp0"

REM Check if .env exists in root
if not exist "%SCRIPT_DIR%.env" (
    echo Creating root .env file from .env.example...
    copy "%SCRIPT_DIR%.env.example" "%SCRIPT_DIR%.env"
    echo WARNING: Please edit .env with your MT5 credentials
)

REM Check prerequisites
echo Checking prerequisites...

python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python 3 is not installed. Please install Python 3.8+
    pause
    exit /b 1
)
echo Python 3 found

node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed. Please install Node.js 16+
    pause
    exit /b 1
)
echo Node.js found

npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not installed. Please install npm
    pause
    exit /b 1
)
echo npm found

echo.
echo All prerequisites satisfied!
echo.

echo ==========================================
echo Starting Services
echo ==========================================
echo.
echo This will start:
echo   1. Backend API (http://localhost:8000)
echo   2. Web Frontend (http://localhost:5173)
echo.
echo Each service will run in a separate window.
echo Close the windows or press Ctrl+C to stop services.
echo.

REM Start backend in new window
start "AlgoTrading Backend" cmd /k "cd /d "%SCRIPT_DIR%" && setup_backend.bat"

REM Wait a moment before starting frontend
timeout /t 2 /nobreak >nul

REM Start web frontend in new window
start "AlgoTrading Web" cmd /k "cd /d "%SCRIPT_DIR%" && setup_web.bat"

echo.
echo Services started!
echo.
echo Access points:
echo   - Web App: http://localhost:5173
echo   - Backend API: http://localhost:8000
echo   - API Docs: http://localhost:8000/docs
echo.
echo Monitor the terminal windows for logs and errors.
echo.
echo Press any key to exit this launcher window...
pause >nul
