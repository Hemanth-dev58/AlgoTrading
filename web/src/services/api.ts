import axios from 'axios';
import { API_BASE_URL } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const mt5Service = {
  initialize: () => api.post('/mt5/initialize'),
  login: (login?: number, password?: string, server?: string) =>
    api.post('/mt5/login', { login, password, server }),
  shutdown: () => api.post('/mt5/shutdown'),
  getAccountInfo: () => api.get('/mt5/account'),
  getSymbolInfo: (symbol: string) => api.post('/mt5/symbol', { symbol }),
  getRates: (symbol: string, timeframe: number, start_pos = 0, count = 100) =>
    api.post('/mt5/rates', { symbol, timeframe, start_pos, count }),
  getTicks: (symbol: string, count = 100) =>
    api.post('/mt5/ticks', { symbol, count }),
  getStatus: () => api.get('/mt5/status'),
};

export const tradingService = {
  sendOrder: (orderData: any) => api.post('/trading/order', orderData),
  getPositions: (symbol?: string) => api.post('/trading/positions', { symbol }),
  getHistory: (fromDate?: Date, toDate?: Date, days = 7) =>
    api.post('/trading/history', { from_date: fromDate, to_date: toDate, days }),
  getOrderTypes: () => api.get('/trading/order-types'),
  getTradeActions: () => api.get('/trading/trade-actions'),
};

export const backtestService = {
  addStrategy: (strategyData: any) => api.post('/backtest/strategy', strategyData),
  runBacktest: (backtestData: any) => api.post('/backtest/run', backtestData),
  getResults: (strategyId: string) => api.get(`/backtest/results/${strategyId}`),
  listStrategies: () => api.get('/backtest/strategies'),
};

export const logsService = {
  getTradeLogs: (limit = 100, symbol?: string) =>
    api.get('/logs/trades', { params: { limit, symbol } }),
  getAccountHistory: (limit = 100, days = 7) =>
    api.get('/logs/account', { params: { limit, days } }),
  getSystemLogs: (limit = 100, level?: string) =>
    api.get('/logs/system', { params: { limit, level } }),
};

export default api;
