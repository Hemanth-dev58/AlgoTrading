"""API router initialization"""

from fastapi import APIRouter

from app.api import mt5, trading, backtest, logs, websocket

router = APIRouter()

# Include sub-routers
router.include_router(mt5.router, prefix="/mt5", tags=["MT5"])
router.include_router(trading.router, prefix="/trading", tags=["Trading"])
router.include_router(backtest.router, prefix="/backtest", tags=["Backtest"])
router.include_router(logs.router, prefix="/logs", tags=["Logs"])
router.include_router(websocket.router, prefix="/ws", tags=["WebSocket"])
