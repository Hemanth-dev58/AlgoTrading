# AlgoTrading Mobile Frontend

React Native (Expo) mobile application for MetaTrader 5 trading platform.

## Features

- **Dashboard**: Login, account overview, and navigation
- **Trading Control**: Place orders and view positions
- **Charts**: Price charts with technical analysis
- **Indicators**: Configure and apply technical indicators
- **Logs & History**: View trading logs and account history

## Tech Stack

- React Native (Expo)
- TypeScript
- React Navigation
- Axios
- React Native Chart Kit
- React Native Picker

## Prerequisites

- Node.js 16+ and npm
- Expo CLI: `npm install -g expo-cli`
- Backend API running on `http://localhost:8000`
- iOS Simulator (Mac) or Android Emulator, or Expo Go app on your phone

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure backend URL:
Edit `src/config.ts` to point to your backend:
```typescript
export const API_BASE_URL = 'http://YOUR_IP:8000/api';
```
Note: For mobile devices, use your computer's IP address, not `localhost`

## Running the App

### Development with Expo

```bash
# Start Expo dev server
npm start

# Or specific platforms
npm run android  # Android
npm run ios      # iOS (Mac only)
npm run web      # Web browser
```

Scan the QR code with:
- Expo Go app (Android)
- Camera app (iOS)

### Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

## Project Structure

```
mobile/
├── src/
│   ├── screens/          # Screen components
│   │   ├── LoginDashboardScreen.tsx
│   │   ├── TradingControlScreen.tsx
│   │   ├── ChartIndicatorsScreen.tsx
│   │   ├── AdvancedIndicatorsScreen.tsx
│   │   └── LogsHistoryScreen.tsx
│   ├── navigation/       # Navigation setup
│   │   └── AppNavigator.tsx
│   ├── services/         # API services
│   │   └── api.ts
│   └── config.ts         # Configuration
├── App.tsx               # Main app component
└── package.json
```

## Features by Screen

### 1. Login & Dashboard
- MT5 connection
- Account information
- Quick navigation buttons

### 2. Trading Control
- Order placement form
- Market and pending orders
- Open positions list
- Stop loss and take profit

### 3. Charts
- Price charts using React Native Chart Kit
- Multiple timeframes
- Symbol selection
- Historical data visualization

### 4. Advanced Indicators
- SMA configuration
- EMA configuration
- RSI settings
- MACD parameters
- Bollinger Bands

### 5. Logs & History
- Trade execution logs
- Account balance history
- MT5 deal history
- System event logs

## API Configuration

The mobile app connects to the backend API:

```typescript
// src/config.ts
export const API_BASE_URL = 'http://localhost:8000/api';
export const WS_BASE_URL = 'ws://localhost:8000/api/ws';
```

**Important**: When testing on a physical device, replace `localhost` with your computer's IP address.

## Development

### Adding New Screens

1. Create screen component in `src/screens/`
2. Add route in `src/navigation/AppNavigator.tsx`
3. Update type definitions in `RootStackParamList`

### Styling

Styles are defined using `StyleSheet.create()` in each component. The app uses a consistent color scheme:
- Primary: `#1976d2`
- Success: `#4caf50`
- Error: `#f44336`
- Warning: `#ff9800`

## Troubleshooting

### Cannot Connect to Backend
- Ensure backend is running
- Use your computer's IP instead of localhost for physical devices
- Check firewall settings
- Verify backend CORS allows mobile app origin

### Charts Not Rendering
- Ensure data is being fetched from backend
- Check console for errors
- Verify chart data format

### Expo Issues
- Clear cache: `expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Update Expo: `npm install expo@latest`

## Testing on Devices

### iOS (Requires Mac)
1. Install Xcode
2. Run `npm run ios`
3. Or use Expo Go app

### Android
1. Install Android Studio
2. Set up Android emulator
3. Run `npm run android`
4. Or use Expo Go app

### Physical Devices
1. Install Expo Go from App Store/Play Store
2. Start dev server: `npm start`
3. Scan QR code with Expo Go (Android) or Camera (iOS)

## License

MIT License
