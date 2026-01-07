# AlgoTrading - MetaTrader 5 Full-Stack Trading Platform

A comprehensive full-stack trading application for MetaTrader 5 with Python FastAPI backend, React web frontend, and React Native mobile app.

## 🚀 Features

### Backend (Python + FastAPI)
- **MT5 Connector**: Complete MetaTrader 5 integration
  - Connection management (initialize, login, shutdown)
  - Account and symbol information
  - Historical data (rates, ticks)
  - Order execution and position management
  - Trading history
- **REST API**: Comprehensive endpoints for all trading operations
- **WebSocket**: Real-time price streaming
- **Backtesting**: Strategy testing framework (stub implementation)
- **Database**: SQLite/PostgreSQL support for logs and history
- **Docker**: Containerized deployment ready

### Web Frontend (React + TypeScript)
- **Login & Dashboard**: MT5 connection and account overview
- **Trading Control**: Place orders, manage positions
- **Charts & Indicators**: TradingView Lightweight Charts integration
- **Advanced Indicators**: Configure SMA, EMA, RSI, MACD, Bollinger Bands
- **Logs & History**: Comprehensive logging and history views
- **Material-UI**: Modern, responsive design

### Mobile App (React Native + Expo)
- **Cross-platform**: iOS and Android support
- **All Web Features**: Complete feature parity with web app
- **Native Charts**: React Native Chart Kit integration
- **Responsive Design**: Optimized for mobile screens

## 📋 Prerequisites

- **Python 3.8+** for backend
- **Node.js 16+** and npm for web and mobile frontends
- **MetaTrader 5 terminal** (Windows) or Wine (Linux/Mac)
- **Docker & Docker Compose** (optional, for containerized deployment)
- **Expo CLI** (for mobile development): `npm install -g expo-cli`

## 🛠️ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Hemanth-dev58/AlgoTrading.git
cd AlgoTrading
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your MT5 credentials
# MT5_LOGIN=your_account_number
# MT5_PASSWORD=your_password
# MT5_SERVER=your_broker_server
```

### 3. Option A: Docker Deployment (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

The backend API will be available at `http://localhost:8000`

### 3. Option B: Manual Setup

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# Edit .env with your credentials

# Run the server
uvicorn app.main:app --reload
```

API available at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

#### Web Frontend Setup

```bash
cd web

# Install dependencies
npm install

# Start development server
npm run dev

> **Login popup note:** No separate database is required for the MT5 login popup; credentials can be saved locally in your browser. To use it, run the FastAPI backend and this web app (the mobile app is optional).
```

Web app available at: `http://localhost:5173`

#### Mobile App Setup

```bash
cd mobile

# Install dependencies
npm install

# Update API URL in src/config.ts to your computer's IP
# export const API_BASE_URL = 'http://YOUR_IP:8000/api';

# Start Expo dev server
npm start

# Scan QR code with Expo Go app (iOS/Android)
# Or run on emulator:
npm run android  # Android
npm run ios      # iOS (Mac only)
```

## 📁 Project Structure

```
AlgoTrading/
├── backend/              # Python FastAPI backend
│   ├── app/
│   │   ├── api/         # API endpoints
│   │   ├── core/        # Configuration
│   │   ├── db/          # Database setup
│   │   ├── models/      # Database models
│   │   └── services/    # Business logic
│   ├── Dockerfile
│   ├── requirements.txt
│   └── README.md
├── web/                 # React web frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API client
│   │   └── App.tsx
│   ├── package.json
│   └── README.md
├── mobile/              # React Native mobile app
│   ├── src/
│   │   ├── screens/     # Screen components
│   │   ├── navigation/  # Navigation setup
│   │   ├── services/    # API client
│   │   └── config.ts
│   ├── App.tsx
│   ├── package.json
│   └── README.md
├── docker-compose.yml   # Docker orchestration
├── .env.example         # Environment template
└── README.md           # This file
```

## 🔧 Configuration

### Backend Configuration

Edit `backend/.env`:

```bash
# MT5 Configuration
MT5_LOGIN=12345678                    # Your MT5 account number
MT5_PASSWORD=YourPassword             # Your MT5 password
MT5_SERVER=MetaQuotes-Demo           # Your broker's server
MT5_PATH=/path/to/terminal64.exe     # Optional: MT5 terminal path

# Database (SQLite or PostgreSQL)
DATABASE_TYPE=sqlite
DATABASE_URL=sqlite:///./trading.db

# Or for PostgreSQL:
# DATABASE_TYPE=postgresql
# DATABASE_URL=postgresql://user:password@localhost:5432/trading

# API
API_HOST=0.0.0.0
API_PORT=8000

# Security
SECRET_KEY=your-secret-key-min-32-chars

# CORS (add your frontend URLs)
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Web Frontend Configuration

Edit `web/.env`:

```bash
VITE_API_BASE_URL=http://localhost:8000/api
VITE_WS_BASE_URL=ws://localhost:8000/api/ws
```

### Mobile App Configuration

Edit `mobile/src/config.ts`:

```typescript
// For physical devices, use your computer's IP address
export const API_BASE_URL = 'http://YOUR_IP:8000/api';
export const WS_BASE_URL = 'ws://YOUR_IP:8000/api/ws';
```

## 📡 API Endpoints

### MT5 Operations
- `POST /api/mt5/initialize` - Initialize MT5
- `POST /api/mt5/login` - Login to MT5
- `POST /api/mt5/shutdown` - Shutdown MT5
- `GET /api/mt5/account` - Get account info
- `POST /api/mt5/symbol` - Get symbol info
- `POST /api/mt5/rates` - Get historical rates
- `POST /api/mt5/ticks` - Get tick data

### Trading Operations
- `POST /api/trading/order` - Send trading order
- `POST /api/trading/positions` - Get positions
- `POST /api/trading/history` - Get trading history

### Backtesting
- `POST /api/backtest/strategy` - Add strategy
- `POST /api/backtest/run` - Run backtest
- `GET /api/backtest/results/{id}` - Get results

### Logs
- `GET /api/logs/trades` - Trade logs
- `GET /api/logs/account` - Account history
- `GET /api/logs/system` - System logs

### WebSocket
- `WS /api/ws/stream` - Real-time data streaming

Full API documentation: `http://localhost:8000/docs`

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest
```

### Web Frontend Tests

```bash
cd web
npm test
```

### Mobile App Tests

```bash
cd mobile
npm test
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Rebuild after code changes
docker-compose up -d --build

# Remove all containers and volumes
docker-compose down -v
```

## 🔒 Security Notes

1. **Change default credentials**: Update `SECRET_KEY` in `.env`
2. **MT5 credentials**: Never commit real credentials to git
3. **CORS**: Configure appropriate origins for production
4. **HTTPS**: Use SSL/TLS in production
5. **Database**: Use PostgreSQL with strong passwords in production

## 📱 Mobile Development

### Testing on Physical Devices

1. Install Expo Go from App Store (iOS) or Play Store (Android)
2. Ensure phone and computer are on same network
3. Update `mobile/src/config.ts` with your computer's IP
4. Run `npm start` in mobile directory
5. Scan QR code with Expo Go (Android) or Camera (iOS)

### Building for Production

```bash
cd mobile

# Install EAS CLI
npm install -g eas-cli

# Configure
eas build:configure

# Build
eas build --platform android
eas build --platform ios
```

## 🚀 Production Deployment

### Backend (Heroku/AWS/DigitalOcean)

1. Use PostgreSQL database
2. Set environment variables
3. Configure CORS for your domains
4. Use HTTPS
5. Set up monitoring and logging

### Web Frontend (Vercel/Netlify)

```bash
cd web
npm run build
# Deploy dist/ folder
```

### Mobile App (App Store/Play Store)

Follow EAS Build and Submit workflows:
```bash
eas build --platform all
eas submit --platform all
```

## 📚 Documentation

- [Backend README](backend/README.md) - Backend setup and API details
- [Web README](web/README.md) - Web frontend development guide
- [Mobile README](mobile/README.md) - Mobile app development guide

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Troubleshooting

### Backend won't start
- Check MT5 terminal is installed
- Verify Python version is 3.8+
- Check database connection
- Review logs for errors

### Web app can't connect to backend
- Ensure backend is running on port 8000
- Check CORS configuration
- Verify API_BASE_URL in .env

### Mobile app can't connect
- Use computer's IP, not localhost
- Ensure devices are on same network
- Check firewall settings
- Verify backend CORS allows mobile origin

### MT5 connection fails
- Verify credentials are correct
- Check MT5 terminal is running
- Ensure server name is correct
- Review MT5 terminal logs

## 💡 Tips

1. **Demo Account**: Start with MetaQuotes demo server for testing
2. **Paper Trading**: Use demo account before live trading
3. **Logging**: Enable DEBUG logging for troubleshooting
4. **Backup**: Regularly backup database and configurations
5. **Updates**: Keep dependencies updated for security

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check documentation in each component's README
- Review API documentation at `/docs`

---

**⚠️ Disclaimer**: This software is for educational purposes. Trading involves risk. Always test thoroughly with demo accounts before using with real money.
