#!/bin/bash

# AlgoTrading Web Frontend Setup and Run Script
# This script sets up and runs the React web frontend

set -e

echo "=========================================="
echo "AlgoTrading Web Frontend Setup"
echo "=========================================="

# Navigate to web directory
cd "$(dirname "$0")/web"

# Check Node.js version
echo "Checking Node.js version..."
NODE_VERSION=$(node --version)
echo "Node.js version: $NODE_VERSION"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOF
VITE_API_BASE_URL=http://localhost:8000/api
VITE_WS_BASE_URL=ws://localhost:8000/api/ws
EOF
    echo "✓ Created .env file with default settings"
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
else
    echo "Dependencies already installed (node_modules exists)"
    echo "Run 'npm install' manually if you need to update dependencies"
fi

echo ""
echo "=========================================="
echo "Web frontend setup complete!"
echo "=========================================="
echo ""
echo "Starting development server..."
echo "Web app will be available at: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Run the development server
npm run dev
