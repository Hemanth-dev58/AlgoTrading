"""MT5 API endpoints"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

# Try to import MetaTrader5, handle gracefully if not available
try:
    import MetaTrader5 as mt5
    MT5_AVAILABLE = True
except ImportError:
    MT5_AVAILABLE = False
    # Use placeholder constants when MT5 is not available
    from app.core import mt5_constants as mt5

from app.services.mt5_connector import mt5_connector
from app.core.config import settings

router = APIRouter()


class LoginRequest(BaseModel):
    login: Optional[int] = None
    password: Optional[str] = None
    server: Optional[str] = None


class SymbolRequest(BaseModel):
    symbol: str


class RatesRequest(BaseModel):
    symbol: str
    timeframe: int = mt5.TIMEFRAME_H1
    start_pos: int = 0
    count: int = 100


class TicksRequest(BaseModel):
    symbol: str
    count: int = 100


@router.post("/initialize")
async def initialize_mt5():
    """Initialize MT5 connection"""
    success = mt5_connector.initialize()
    if not success:
        raise HTTPException(status_code=500, detail="Failed to initialize MT5")
    return {"status": "success", "message": "MT5 initialized"}


@router.post("/login")
async def login_mt5(request: LoginRequest):
    """Login to MT5 account"""
    login = request.login or settings.MT5_LOGIN
    password = request.password or settings.MT5_PASSWORD
    server = request.server or settings.MT5_SERVER
    
    success = mt5_connector.login(login, password, server)
    if not success:
        raise HTTPException(status_code=401, detail="Failed to login to MT5")
    
    return {"status": "success", "message": f"Logged in to account {login}"}


@router.post("/shutdown")
async def shutdown_mt5():
    """Shutdown MT5 connection"""
    mt5_connector.shutdown()
    return {"status": "success", "message": "MT5 connection closed"}


@router.get("/account")
async def get_account_info():
    """Get account information"""
    account_info = mt5_connector.account_info()
    if account_info is None:
        raise HTTPException(status_code=500, detail="Failed to get account info")
    return account_info


@router.post("/symbol")
async def get_symbol_info(request: SymbolRequest):
    """Get symbol information"""
    symbol_info = mt5_connector.symbol_info(request.symbol)
    if symbol_info is None:
        raise HTTPException(
            status_code=404,
            detail=f"Symbol {request.symbol} not found"
        )
    return symbol_info


@router.post("/rates")
async def get_rates(request: RatesRequest):
    """Get historical rates"""
    rates = mt5_connector.copy_rates(
        request.symbol,
        request.timeframe,
        request.start_pos,
        request.count
    )
    if rates is None:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get rates for {request.symbol}"
        )
    return {"symbol": request.symbol, "rates": rates}


@router.post("/ticks")
async def get_ticks(request: TicksRequest):
    """Get tick data"""
    ticks = mt5_connector.copy_ticks(request.symbol, request.count)
    if ticks is None:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get ticks for {request.symbol}"
        )
    return {"symbol": request.symbol, "ticks": ticks}


@router.get("/status")
async def get_status():
    """Get MT5 connection status"""
    return {
        "mt5_available": MT5_AVAILABLE,
        "initialized": mt5_connector.initialized,
        "connected": mt5_connector.connected,
        "message": "MT5 module available" if MT5_AVAILABLE else "MT5 module not available (install on Windows for full functionality)"
    }
