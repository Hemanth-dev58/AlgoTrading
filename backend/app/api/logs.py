"""Logs API endpoints"""

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import Optional
from datetime import datetime, timedelta

from app.db.database import get_db
from app.models.models import TradeLog, AccountHistory, SystemLog

router = APIRouter()


@router.get("/trades")
async def get_trade_logs(
    limit: int = 100,
    symbol: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Get trade logs"""
    try:
        query = select(TradeLog).order_by(desc(TradeLog.timestamp)).limit(limit)
        
        if symbol:
            query = query.where(TradeLog.symbol == symbol)
        
        result = await db.execute(query)
        logs = result.scalars().all()
        
        return {
            "logs": [
                {
                    "id": log.id,
                    "timestamp": log.timestamp.isoformat(),
                    "symbol": log.symbol,
                    "order_type": log.order_type,
                    "volume": log.volume,
                    "price": log.price,
                    "sl": log.sl,
                    "tp": log.tp,
                    "status": log.status,
                    "order_id": log.order_id,
                    "comment": log.comment
                }
                for log in logs
            ],
            "count": len(logs)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get trade logs: {e}")


@router.get("/account")
async def get_account_history(
    limit: int = 100,
    days: int = 7,
    db: AsyncSession = Depends(get_db)
):
    """Get account history"""
    try:
        from_date = datetime.utcnow() - timedelta(days=days)
        
        query = (
            select(AccountHistory)
            .where(AccountHistory.timestamp >= from_date)
            .order_by(desc(AccountHistory.timestamp))
            .limit(limit)
        )
        
        result = await db.execute(query)
        history = result.scalars().all()
        
        return {
            "history": [
                {
                    "id": h.id,
                    "timestamp": h.timestamp.isoformat(),
                    "balance": h.balance,
                    "equity": h.equity,
                    "margin": h.margin,
                    "free_margin": h.free_margin,
                    "margin_level": h.margin_level,
                    "profit": h.profit
                }
                for h in history
            ],
            "count": len(history)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get account history: {e}")


@router.get("/system")
async def get_system_logs(
    limit: int = 100,
    level: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    """Get system logs"""
    try:
        query = select(SystemLog).order_by(desc(SystemLog.timestamp)).limit(limit)
        
        if level:
            query = query.where(SystemLog.level == level)
        
        result = await db.execute(query)
        logs = result.scalars().all()
        
        return {
            "logs": [
                {
                    "id": log.id,
                    "timestamp": log.timestamp.isoformat(),
                    "level": log.level,
                    "source": log.source,
                    "message": log.message,
                    "details": log.details
                }
                for log in logs
            ],
            "count": len(logs)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get system logs: {e}")
