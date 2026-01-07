# AlgoTrading Backend

Python FastAPI backend for MetaTrader 5 trading platform with real-time WebSocket streaming, backtesting, and database logging.

## Features

- **MT5 Connector**: Full MetaTrader5 integration
  - Initialize, login, shutdown
  - Account info and symbol info
  - Historical data (rates, ticks)
  - Order execution
  - Position management
  - Trading history
  
- **REST API**: Comprehensive endpoints for trading operations
- **WebSocket Streaming**: Real-time price updates and event notifications
- **Backtesting**: Strategy backtesting framework (stub implementation)
- **Database**: SQLite/PostgreSQL support for logs and history
- **Docker**: Containerized deployment

## Prerequisites

- Python 3.8+
- MetaTrader 5 terminal (for Windows) or Wine (for Linux/Mac)
- PostgreSQL (optional, SQLite is default)

## Installation

### Local Development

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your MT5 credentials
```

4. Run the server:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`
API documentation at `http://localhost:8000/docs`

### Docker Deployment

Build and run with Docker:
```bash
docker build -t algotrading-backend .
docker run -p 8000:8000 --env-file .env algotrading-backend
```

Or use docker-compose (from root directory):
```bash
docker-compose up backend
```

## Configuration

Edit `.env` file or set environment variables:

### MT5 Configuration
- `MT5_LOGIN`: Your MT5 account number
- `MT5_PASSWORD`: Your MT5 account password
- `MT5_SERVER`: Your broker's server name
- `MT5_PATH`: Path to MT5 terminal (optional)

### Database Configuration
- `DATABASE_TYPE`: "sqlite" or "postgresql"
- `DATABASE_URL`: Database connection string

### API Configuration
- `API_HOST`: Server host (default: 0.0.0.0)
- `API_PORT`: Server port (default: 8000)
- `CORS_ORIGINS`: Allowed CORS origins

## API Endpoints

### MT5 Operations
- `POST /api/mt5/initialize` - Initialize MT5 connection
- `POST /api/mt5/login` - Login to MT5 account
- `POST /api/mt5/shutdown` - Shutdown MT5 connection
- `GET /api/mt5/account` - Get account information
- `POST /api/mt5/symbol` - Get symbol information
- `POST /api/mt5/rates` - Get historical rates
- `POST /api/mt5/ticks` - Get tick data
- `GET /api/mt5/status` - Get connection status

### Trading Operations
- `POST /api/trading/order` - Send trading order
- `POST /api/trading/positions` - Get open positions
- `POST /api/trading/history` - Get trading history
- `GET /api/trading/order-types` - Get available order types
- `GET /api/trading/trade-actions` - Get available trade actions

### Backtesting
- `POST /api/backtest/strategy` - Add strategy
- `POST /api/backtest/run` - Run backtest
- `GET /api/backtest/results/{strategy_id}` - Get results
- `GET /api/backtest/strategies` - List strategies

### Logs
- `GET /api/logs/trades` - Get trade logs
- `GET /api/logs/account` - Get account history
- `GET /api/logs/system` - Get system logs

### WebSocket
- `WS /api/ws/stream` - Real-time data streaming

## WebSocket Usage

Connect to `ws://localhost:8000/api/ws/stream`

Send JSON messages:
```json
{"action": "subscribe", "symbol": "EURUSD"}
{"action": "unsubscribe", "symbol": "EURUSD"}
{"action": "ping"}
```

## Database Schema

### Tables
- `trade_logs`: Trade execution history
- `account_history`: Account balance/equity snapshots
- `system_logs`: System event logs
- `backtest_results`: Backtesting results

## Development

### Running Tests
```bash
pytest
```

### Code Quality
```bash
# Format code
black app/

# Lint
pylint app/
```

## Notes

- For demo/paper trading, use MetaQuotes demo server credentials
- MT5 terminal must be running for the connector to work
- WebSocket streaming requires active MT5 connection
- Backtest module is a stub - implement your strategy logic

## License

MIT License
