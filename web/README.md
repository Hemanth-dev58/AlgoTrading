# Web Frontend - React + TypeScript

React-based web frontend for the AlgoTrading platform with Material-UI components and TradingView charts.

## 🚀 Features

- **Login & Dashboard**: MT5 connection and account overview
- **Trading Control**: Place orders, manage positions
- **Charts & Indicators**: TradingView Lightweight Charts integration
- **Advanced Indicators**: Configure SMA, EMA, RSI, MACD, Bollinger Bands
- **Logs & History**: Comprehensive logging and history views
- **Material-UI**: Modern, responsive design
- **TypeScript**: Type-safe development
- **Vite**: Fast development and build tooling

## 📋 Prerequisites

- Node.js 16+ and npm
- Backend API running on `http://localhost:8000`

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your backend API URL
# VITE_API_BASE_URL=http://localhost:8000/api
# VITE_WS_BASE_URL=ws://localhost:8000/api/ws
```

### 3. Start Development Server

```bash
npm run dev
```

Web app will be available at: `http://localhost:5173`

## 📁 Project Structure

```
web/
├── src/
│   ├── components/       # Reusable components
│   │   └── Layout.tsx   # Main layout wrapper
│   ├── pages/           # Page components
│   │   ├── LoginDashboard.tsx
│   │   ├── TradingControl.tsx
│   │   ├── ChartIndicators.tsx
│   │   ├── AdvancedIndicators.tsx
│   │   └── LogsHistory.tsx
│   ├── services/        # API client
│   │   └── api.ts       # Backend API integration
│   ├── config.ts        # Configuration
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── public/              # Static assets
├── index.html           # HTML template
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── vite.config.ts       # Vite config
└── README.md           # This file
```

## 🔧 Configuration

### Environment Variables

Edit `.env`:

```bash
VITE_API_BASE_URL=http://localhost:8000/api
VITE_WS_BASE_URL=ws://localhost:8000/api/ws
```

For production, update with your deployed backend URL.

## 🎨 Available Pages

### Login & Dashboard
- Connect to MT5
- View account information
- Account balance and equity
- Open positions summary

### Trading Control
- Place market orders (Buy/Sell)
- View open positions
- Close positions
- Trading history

### Chart & Indicators
- Real-time price charts
- TradingView Lightweight Charts
- Basic technical indicators
- Multiple timeframes

### Advanced Indicators
- Configure SMA (Simple Moving Average)
- Configure EMA (Exponential Moving Average)
- Configure RSI (Relative Strength Index)
- Configure MACD (Moving Average Convergence Divergence)
- Configure Bollinger Bands
- Customizable parameters

### Logs & History
- Trade logs
- Account history
- System logs
- Error tracking

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🏗️ Build

### Development Build

```bash
npm run build
```

### Production Build

```bash
npm run build
```

Build output will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## 🚀 Deployment

### Option 1: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### Option 3: Static Hosting

Build the app and deploy the `dist/` folder to any static hosting service:
- GitHub Pages
- AWS S3
- Google Cloud Storage
- Azure Static Web Apps

## 🔒 Security

1. **Environment Variables**: Never commit `.env` file
2. **API URLs**: Use environment variables for API endpoints
3. **HTTPS**: Use HTTPS in production
4. **CORS**: Ensure backend CORS allows your domain

## 📚 Dependencies

### Main Dependencies
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Material-UI**: Component library
- **React Router**: Client-side routing
- **Lightweight Charts**: TradingView charts
- **Axios**: HTTP client

### Dev Dependencies
- **Vite**: Build tool
- **ESLint**: Code linting
- **TypeScript**: Type checking

## 🎯 Development Tips

1. **Hot Reload**: Changes automatically refresh in browser
2. **TypeScript**: Use types for better development experience
3. **Components**: Create reusable components in `src/components/`
4. **API Service**: Use `src/services/api.ts` for all backend calls
5. **Material-UI**: Use MUI components for consistent design

## 🐛 Troubleshooting

### Port Already in Use
If port 5173 is already in use:
```bash
# Kill the process
lsof -ti:5173 | xargs kill -9

# Or use a different port
npm run dev -- --port 3000
```

### API Connection Issues
- Ensure backend is running on port 8000
- Check `VITE_API_BASE_URL` in `.env`
- Verify CORS configuration in backend
- Check browser console for errors

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check TypeScript errors: `npm run tsc`

### Module Not Found
- Ensure all imports use correct paths
- Check that modules are installed: `npm install`
- Verify package.json has all dependencies

## 📞 Support

For issues and questions:
- Check main project [README](../README.md)
- Review backend API documentation at `http://localhost:8000/docs`
- Open an issue on GitHub

---

**⚠️ Disclaimer**: This software is for educational purposes. Trading involves risk. Always test thoroughly with demo accounts before using with real money.
