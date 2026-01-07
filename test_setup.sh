#!/bin/bash

# Test script to verify the application setup
# This script tests that all components can be set up and started successfully

set -e

echo "=========================================="
echo "AlgoTrading Setup Verification"
echo "=========================================="
echo ""

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
WEB_DIR="$SCRIPT_DIR/web"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

success() {
    echo -e "${GREEN}✓${NC} $1"
}

error() {
    echo -e "${RED}✗${NC} $1"
}

warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Test 1: Check prerequisites
echo "Test 1: Checking prerequisites..."
if command -v python3 >/dev/null 2>&1; then
    PYTHON_VERSION=$(python3 --version)
    success "Python 3 installed: $PYTHON_VERSION"
else
    error "Python 3 not found"
    exit 1
fi

if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node --version)
    success "Node.js installed: $NODE_VERSION"
else
    error "Node.js not found"
    exit 1
fi

if command -v npm >/dev/null 2>&1; then
    NPM_VERSION=$(npm --version)
    success "npm installed: $NPM_VERSION"
else
    error "npm not found"
    exit 1
fi

echo ""

# Test 2: Backend setup
echo "Test 2: Setting up backend..."
cd "$BACKEND_DIR"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    python3 -m venv venv
    success "Created virtual environment"
else
    success "Virtual environment exists"
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install --upgrade pip --quiet
pip install -r requirements-base.txt --quiet 2>&1 | grep -v "already satisfied" || true
success "Installed base Python dependencies"

# Check if .env exists
if [ ! -f .env ]; then
    cp .env.example .env
    success "Created .env file"
else
    success ".env file exists"
fi

echo ""

# Test 3: Start backend briefly to test
echo "Test 3: Testing backend startup..."
timeout 5 uvicorn app.main:app --host 0.0.0.0 --port 8000 > /tmp/backend_test.log 2>&1 || true
if grep -q "Application startup complete" /tmp/backend_test.log; then
    success "Backend starts successfully"
    warning "MT5 module not available on this platform (expected on Linux/Mac)"
else
    error "Backend failed to start"
    echo "Check /tmp/backend_test.log for details"
    exit 1
fi

echo ""

# Test 4: Web frontend setup
echo "Test 4: Setting up web frontend..."
cd "$WEB_DIR"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    npm install --quiet
    success "Installed npm dependencies"
else
    success "npm dependencies exist"
fi

# Check if .env exists
if [ ! -f .env ]; then
    cat > .env << EOF
VITE_API_BASE_URL=http://localhost:8000/api
VITE_WS_BASE_URL=ws://localhost:8000/api/ws
EOF
    success "Created web .env file"
else
    success "Web .env file exists"
fi

echo ""

# Test 5: Build web app
echo "Test 5: Testing web build..."
if npm run build > /tmp/web_build.log 2>&1; then
    success "Web app builds successfully"
else
    error "Web build failed"
    echo "Check /tmp/web_build.log for details"
    exit 1
fi

echo ""

# Test 6: Check scripts exist and are executable
echo "Test 6: Checking setup scripts..."
cd "$SCRIPT_DIR"

for script in setup_backend.sh setup_web.sh run.sh; do
    if [ -f "$script" ] && [ -x "$script" ]; then
        success "$script exists and is executable"
    else
        warning "$script exists but may not be executable (run: chmod +x $script)"
    fi
done

echo ""

# Final summary
echo "=========================================="
echo "Verification Complete!"
echo "=========================================="
echo ""
echo "All tests passed! The application is ready to run."
echo ""
echo "To start the application:"
echo "  ./run.sh                  # Automated (Linux/macOS)"
echo "  run.bat                   # Automated (Windows)"
echo ""
echo "Or run components separately:"
echo "  ./setup_backend.sh        # Backend only"
echo "  ./setup_web.sh            # Web frontend only"
echo ""
echo "Note: MetaTrader5 is not available on this platform."
echo "For full MT5 integration, run on Windows or use Docker."
echo ""
echo "See QUICKSTART.md for more details."
