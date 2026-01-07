# Quick Start Guide

This guide will help you run the AlgoTrading application quickly on your local machine.

## Prerequisites

Before running the application, ensure you have:

- **Python 3.8+** installed
- **Node.js 16+** and npm installed
- **MetaTrader 5** terminal (optional for testing, required for actual trading)

## Quick Start (3 Simple Steps)

### Option 1: Automated Setup (Recommended)

#### On Linux/macOS:
```bash
./run.sh
```

#### On Windows:
```cmd
run.bat
```

This single command will:
- Check all prerequisites
- Set up both backend and frontend
- Install all dependencies
- Create environment files
- Start both services in separate terminal windows

### Option 2: Manual Setup (Step by Step)

#### Step 1: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit with your MT5 credentials (optional for demo mode)
# nano .env  # or use your preferred editor
```

#### Step 2: Run Backend

Open a terminal and run:

**Linux/macOS:**
```bash
./setup_backend.sh
```

**Windows:**
```cmd
setup_backend.bat
```

The backend will be available at:
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs

#### Step 3: Run Web Frontend

Open a **new terminal** and run:

**Linux/macOS:**
```bash
./setup_web.sh
```

**Windows:**
```cmd
setup_web.bat
```

The web app will be available at:
- Web App: http://localhost:5173

## What Each Script Does

### `run.sh` / `run.bat`
- Checks prerequisites (Python, Node.js, npm)
- Creates environment files if they don't exist
- Launches both backend and frontend in separate terminals
- Provides status messages and access URLs

### `setup_backend.sh` / `setup_backend.bat`
- Creates Python virtual environment
- Installs all Python dependencies
- Creates backend .env file from template
- Starts the FastAPI server with auto-reload

### `setup_web.sh` / `setup_web.bat`
- Installs npm dependencies
- Creates web .env file with default settings
- Starts the Vite development server

## First Time Setup

On first run, the scripts will:

1. **Create virtual environment** for Python (backend/venv/)
2. **Install dependencies** from requirements.txt and package.json
3. **Create .env files** from templates
4. **Set up the database** (SQLite by default)

This may take a few minutes on first run. Subsequent runs will be much faster!

## Default Configuration

The default configuration uses:
- **Backend:** http://localhost:8000
- **Frontend:** http://localhost:5173
- **Database:** SQLite (no separate database server needed)
- **MT5 Connection:** Demo mode (edit .env for real credentials)

## Troubleshooting

### "Command not found" errors
- Make sure Python and Node.js are installed and in your PATH
- On Linux/macOS, you may need to run: `chmod +x *.sh`

### Port already in use
- Make sure ports 8000 and 5173 are not being used by other applications
- You can change ports in the respective .env files

### Permission denied (Linux/macOS)
```bash
chmod +x run.sh setup_backend.sh setup_web.sh
```

### Backend won't connect to MT5
- Make sure MetaTrader 5 terminal is installed
- Update backend/.env with your MT5 credentials
- For testing without MT5, the app will work in limited mode

## Next Steps

1. **Open the web app**: http://localhost:5173
2. **Review API docs**: http://localhost:8000/docs
3. **Configure MT5 credentials** in backend/.env (for real trading)
4. **Read the full README.md** for advanced configuration

## Stopping the Application

- Press `Ctrl+C` in each terminal window
- Or simply close the terminal windows

## Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Review [backend/README.md](backend/README.md) for backend-specific info
- Review [web/README.md](web/README.md) for frontend-specific info
- Open an issue on GitHub for bugs or questions

---

**Happy Trading! 🚀**

Remember: Always test with demo accounts before using real money!
