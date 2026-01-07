#!/bin/bash

# AlgoTrading Backend Setup and Run Script
# This script sets up and runs the FastAPI backend server

set -e

echo "=========================================="
echo "AlgoTrading Backend Setup"
echo "=========================================="

# Navigate to backend directory
cd "$(dirname "$0")/backend"

# Check Python version
echo "Checking Python version..."
PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
echo "Python version: $PYTHON_VERSION"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your MT5 credentials before running the application"
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip --quiet

# Install dependencies
echo "Installing dependencies..."
echo "Installing base dependencies..."
pip install -r requirements-base.txt --quiet

# Try to install Windows-specific dependencies (MetaTrader5)
# This will fail on non-Windows systems, which is expected
if [ -f requirements-windows.txt ]; then
    echo "Attempting to install Windows-specific dependencies (MetaTrader5)..."
    if pip install -r requirements-windows.txt --quiet 2>/dev/null; then
        echo "✓ MetaTrader5 installed successfully"
    else
        echo "⚠️  MetaTrader5 not installed (not available on this platform)"
        echo "   The application will run in limited mode without MT5 integration"
        echo "   For full functionality, run on Windows or use Docker"
    fi
fi

echo ""
echo "=========================================="
echo "Backend setup complete!"
echo "=========================================="
echo ""
echo "Starting FastAPI server..."
echo "API will be available at: http://localhost:8000"
echo "API docs will be available at: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Run the server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
