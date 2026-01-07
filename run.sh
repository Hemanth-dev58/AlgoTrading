#!/bin/bash

# AlgoTrading Master Run Script
# This script runs both backend and frontend in separate terminal sessions

set -e

echo "=========================================="
echo "AlgoTrading - Full Stack Launcher"
echo "=========================================="
echo ""

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Check if .env exists in root
if [ ! -f "$SCRIPT_DIR/.env" ]; then
    echo "Creating root .env file from .env.example..."
    cp "$SCRIPT_DIR/.env.example" "$SCRIPT_DIR/.env"
    echo "⚠️  Please edit .env with your MT5 credentials"
fi

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "Checking prerequisites..."

if ! command_exists python3; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+"
    exit 1
fi
echo "✓ Python 3 found"

if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 16+"
    exit 1
fi
echo "✓ Node.js found"

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm"
    exit 1
fi
echo "✓ npm found"

echo ""
echo "All prerequisites satisfied!"
echo ""

# Make scripts executable
chmod +x "$SCRIPT_DIR/setup_backend.sh"
chmod +x "$SCRIPT_DIR/setup_web.sh"

echo "=========================================="
echo "Starting Services"
echo "=========================================="
echo ""
echo "This will start:"
echo "  1. Backend API (http://localhost:8000)"
echo "  2. Web Frontend (http://localhost:5173)"
echo ""
echo "Each service will run in a separate terminal."
echo "Close the terminals or press Ctrl+C to stop services."
echo ""

# Detect the operating system and terminal
OS="$(uname -s)"

case "$OS" in
    Linux*)
        # Try different terminal emulators on Linux
        if command_exists gnome-terminal; then
            echo "Using gnome-terminal..."
            gnome-terminal --title="AlgoTrading Backend" -- bash -c "cd '$SCRIPT_DIR' && ./setup_backend.sh; exec bash"
            gnome-terminal --title="AlgoTrading Web" -- bash -c "cd '$SCRIPT_DIR' && ./setup_web.sh; exec bash"
        elif command_exists xterm; then
            echo "Using xterm..."
            xterm -title "AlgoTrading Backend" -e "cd '$SCRIPT_DIR' && ./setup_backend.sh; bash" &
            xterm -title "AlgoTrading Web" -e "cd '$SCRIPT_DIR' && ./setup_web.sh; bash" &
        elif command_exists konsole; then
            echo "Using konsole..."
            konsole --title "AlgoTrading Backend" -e bash -c "cd '$SCRIPT_DIR' && ./setup_backend.sh; exec bash" &
            konsole --title "AlgoTrading Web" -e bash -c "cd '$SCRIPT_DIR' && ./setup_web.sh; exec bash" &
        else
            echo "⚠️  No suitable terminal emulator found."
            echo "Running in sequential mode (not recommended)..."
            echo ""
            echo "You can run each component manually:"
            echo "  Terminal 1: ./setup_backend.sh"
            echo "  Terminal 2: ./setup_web.sh"
            exit 1
        fi
        ;;
    Darwin*)
        echo "Using macOS Terminal..."
        osascript -e "tell application \"Terminal\" to do script \"cd '$SCRIPT_DIR' && ./setup_backend.sh\""
        osascript -e "tell application \"Terminal\" to do script \"cd '$SCRIPT_DIR' && ./setup_web.sh\""
        ;;
    CYGWIN*|MINGW*|MSYS*)
        echo "Windows detected. Please use run.bat instead."
        exit 1
        ;;
    *)
        echo "⚠️  Unsupported operating system: $OS"
        echo ""
        echo "Please run each component manually:"
        echo "  Terminal 1: ./setup_backend.sh"
        echo "  Terminal 2: ./setup_web.sh"
        exit 1
        ;;
esac

echo ""
echo "✓ Services started!"
echo ""
echo "Access points:"
echo "  - Web App: http://localhost:5173"
echo "  - Backend API: http://localhost:8000"
echo "  - API Docs: http://localhost:8000/docs"
echo ""
echo "Monitor the terminal windows for logs and errors."
