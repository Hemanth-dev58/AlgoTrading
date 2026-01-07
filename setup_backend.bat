@echo off
REM AlgoTrading Backend Setup and Run Script (Windows)
REM This script sets up and runs the FastAPI backend server

echo ==========================================
echo AlgoTrading Backend Setup
echo ==========================================

REM Navigate to backend directory
cd "%~dp0backend"

REM Check Python
echo Checking Python version...
python --version
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo WARNING: Please edit backend\.env with your MT5 credentials before running
)

REM Create virtual environment if it doesn't exist
if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Upgrade pip
echo Upgrading pip...
python -m pip install --upgrade pip --quiet

REM Install dependencies
echo Installing dependencies...
echo Installing base dependencies...
pip install -r requirements-base.txt --quiet

REM Try to install Windows-specific dependencies (MetaTrader5)
if exist requirements-windows.txt (
    echo Installing Windows-specific dependencies (MetaTrader5)...
    pip install -r requirements-windows.txt --quiet
    if errorlevel 1 (
        echo WARNING: MetaTrader5 installation failed
        echo The application will run in limited mode
    ) else (
        echo MetaTrader5 installed successfully
    )
)

echo.
echo ==========================================
echo Backend setup complete!
echo ==========================================
echo.
echo Starting FastAPI server...
echo API will be available at: http://localhost:8000
echo API docs will be available at: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.

REM Run the server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

pause
