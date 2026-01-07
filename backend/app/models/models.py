"""Database models"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean
from datetime import datetime

from app.db.database import Base


class TradeLog(Base):
    """Trade execution log"""
    __tablename__ = "trade_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    symbol = Column(String(50), index=True)
    order_type = Column(String(20))
    volume = Column(Float)
    price = Column(Float)
    sl = Column(Float, nullable=True)
    tp = Column(Float, nullable=True)
    status = Column(String(20))
    order_id = Column(Integer, nullable=True)
    comment = Column(Text, nullable=True)


class AccountHistory(Base):
    """Account balance and equity history"""
    __tablename__ = "account_history"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    balance = Column(Float)
    equity = Column(Float)
    margin = Column(Float)
    free_margin = Column(Float)
    margin_level = Column(Float, nullable=True)
    profit = Column(Float)


class SystemLog(Base):
    """System event log"""
    __tablename__ = "system_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    level = Column(String(20))
    source = Column(String(100))
    message = Column(Text)
    details = Column(Text, nullable=True)


class BacktestResult(Base):
    """Backtest results storage"""
    __tablename__ = "backtest_results"
    
    id = Column(Integer, primary_key=True, index=True)
    strategy_id = Column(String(100), index=True)
    symbol = Column(String(50))
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    initial_capital = Column(Float)
    final_capital = Column(Float)
    total_return = Column(Float)
    total_trades = Column(Integer)
    winning_trades = Column(Integer)
    losing_trades = Column(Integer)
    win_rate = Column(Float)
    max_drawdown = Column(Float)
    sharpe_ratio = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    results_json = Column(Text)
