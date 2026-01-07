"""Trading API endpoints"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta

# Try to import MetaTrader5, handle gracefully if not available
try:
    import MetaTrader5 as mt5
    MT5_AVAILABLE = True
except ImportError:
    MT5_AVAILABLE = False
    mt5 = None
    # Define placeholder values for when MT5 is not available
    class _MT5Placeholder:
        TRADE_ACTION_DEAL = 1
        ORDER_TYPE_BUY = 0
        ORDER_TYPE_SELL = 1
        ORDER_FILLING_FOK = 0
        ORDER_FILLING_IOC = 1
        ORDER_FILLING_RETURN = 2
    if mt5 is None:
        mt5 = _MT5Placeholder()

from app.services.mt5_connector import mt5_connector

router = APIRouter()


class OrderRequest(BaseModel):
    action: int  # mt5.TRADE_ACTION_*
    symbol: str
    volume: float
    order_type: int  # mt5.ORDER_TYPE_*
    price: Optional[float] = None
    sl: Optional[float] = None
    tp: Optional[float] = None
    deviation: int = 20
    magic: int = 234000
    comment: str = ""


class PositionRequest(BaseModel):
    symbol: Optional[str] = None


class HistoryRequest(BaseModel):
    from_date: Optional[datetime] = None
    to_date: Optional[datetime] = None
    days: int = 7


@router.post("/order")
async def send_order(order: OrderRequest):
    """Send trading order"""
    request = {
        "action": order.action,
        "symbol": order.symbol,
        "volume": order.volume,
        "type": order.order_type,
        "deviation": order.deviation,
        "magic": order.magic,
        "comment": order.comment,
    }
    
    if order.price is not None:
        request["price"] = order.price
    if order.sl is not None:
        request["sl"] = order.sl
    if order.tp is not None:
        request["tp"] = order.tp
    
    result = mt5_connector.order_send(request)
    if result is None:
        raise HTTPException(status_code=500, detail="Failed to send order")
    
    return result


@router.post("/positions")
async def get_positions(request: PositionRequest):
    """Get open positions"""
    positions = mt5_connector.positions_get(request.symbol)
    if positions is None:
        raise HTTPException(status_code=500, detail="Failed to get positions")
    
    return {"positions": positions, "count": len(positions)}


@router.post("/history")
async def get_history(request: HistoryRequest):
    """Get trading history"""
    to_date = request.to_date or datetime.now()
    from_date = request.from_date or (to_date - timedelta(days=request.days))
    
    deals = mt5_connector.history_deals_get(from_date, to_date)
    if deals is None:
        raise HTTPException(status_code=500, detail="Failed to get history")
    
    return {
        "deals": deals,
        "count": len(deals),
        "from_date": from_date.isoformat(),
        "to_date": to_date.isoformat()
    }


@router.get("/order-types")
async def get_order_types():
    """Get available order types"""
    return {
        "ORDER_TYPE_BUY": mt5.ORDER_TYPE_BUY,
        "ORDER_TYPE_SELL": mt5.ORDER_TYPE_SELL,
        "ORDER_TYPE_BUY_LIMIT": mt5.ORDER_TYPE_BUY_LIMIT,
        "ORDER_TYPE_SELL_LIMIT": mt5.ORDER_TYPE_SELL_LIMIT,
        "ORDER_TYPE_BUY_STOP": mt5.ORDER_TYPE_BUY_STOP,
        "ORDER_TYPE_SELL_STOP": mt5.ORDER_TYPE_SELL_STOP,
    }


@router.get("/trade-actions")
async def get_trade_actions():
    """Get available trade actions"""
    return {
        "TRADE_ACTION_DEAL": mt5.TRADE_ACTION_DEAL,
        "TRADE_ACTION_PENDING": mt5.TRADE_ACTION_PENDING,
        "TRADE_ACTION_SLTP": mt5.TRADE_ACTION_SLTP,
        "TRADE_ACTION_MODIFY": mt5.TRADE_ACTION_MODIFY,
        "TRADE_ACTION_REMOVE": mt5.TRADE_ACTION_REMOVE,
    }
