"""WebSocket endpoints for real-time streaming"""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List, Dict
import asyncio
import json
import logging
from datetime import datetime

from app.services.mt5_connector import mt5_connector

router = APIRouter()
logger = logging.getLogger(__name__)


class ConnectionManager:
    """Manage WebSocket connections"""
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.subscriptions: Dict[str, List[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket):
        """Accept new connection"""
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"New WebSocket connection. Total: {len(self.active_connections)}")
    
    def disconnect(self, websocket: WebSocket):
        """Remove connection"""
        self.active_connections.remove(websocket)
        
        # Remove from subscriptions
        for symbol in list(self.subscriptions.keys()):
            if websocket in self.subscriptions[symbol]:
                self.subscriptions[symbol].remove(websocket)
                if not self.subscriptions[symbol]:
                    del self.subscriptions[symbol]
        
        logger.info(f"WebSocket disconnected. Total: {len(self.active_connections)}")
    
    def subscribe(self, websocket: WebSocket, symbol: str):
        """Subscribe to symbol updates"""
        if symbol not in self.subscriptions:
            self.subscriptions[symbol] = []
        if websocket not in self.subscriptions[symbol]:
            self.subscriptions[symbol].append(websocket)
            logger.info(f"Subscribed to {symbol}")
    
    def unsubscribe(self, websocket: WebSocket, symbol: str):
        """Unsubscribe from symbol updates"""
        if symbol in self.subscriptions and websocket in self.subscriptions[symbol]:
            self.subscriptions[symbol].remove(websocket)
            if not self.subscriptions[symbol]:
                del self.subscriptions[symbol]
            logger.info(f"Unsubscribed from {symbol}")
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        """Send message to specific connection"""
        await websocket.send_text(message)
    
    async def broadcast_to_symbol(self, symbol: str, message: dict):
        """Broadcast message to all subscribers of a symbol"""
        if symbol in self.subscriptions:
            message_text = json.dumps(message)
            for connection in self.subscriptions[symbol]:
                try:
                    await connection.send_text(message_text)
                except Exception as e:
                    logger.error(f"Error sending to connection: {e}")


manager = ConnectionManager()


@router.websocket("/stream")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time data streaming
    
    Client sends JSON messages:
    - {"action": "subscribe", "symbol": "EURUSD"}
    - {"action": "unsubscribe", "symbol": "EURUSD"}
    - {"action": "ping"}
    """
    await manager.connect(websocket)
    
    try:
        while True:
            data = await websocket.receive_text()
            
            try:
                message = json.loads(data)
                action = message.get("action")
                
                if action == "subscribe":
                    symbol = message.get("symbol")
                    if symbol:
                        manager.subscribe(websocket, symbol)
                        await manager.send_personal_message(
                            json.dumps({
                                "type": "subscription",
                                "status": "success",
                                "symbol": symbol
                            }),
                            websocket
                        )
                
                elif action == "unsubscribe":
                    symbol = message.get("symbol")
                    if symbol:
                        manager.unsubscribe(websocket, symbol)
                        await manager.send_personal_message(
                            json.dumps({
                                "type": "unsubscription",
                                "status": "success",
                                "symbol": symbol
                            }),
                            websocket
                        )
                
                elif action == "ping":
                    await manager.send_personal_message(
                        json.dumps({
                            "type": "pong",
                            "timestamp": datetime.now().isoformat()
                        }),
                        websocket
                    )
                
            except json.JSONDecodeError:
                await manager.send_personal_message(
                    json.dumps({"type": "error", "message": "Invalid JSON"}),
                    websocket
                )
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket)


async def broadcast_price_updates():
    """Background task to broadcast price updates (stub)"""
    while True:
        await asyncio.sleep(1)
        
        # For each subscribed symbol, get latest tick and broadcast
        for symbol in list(manager.subscriptions.keys()):
            if mt5_connector.connected:
                ticks = mt5_connector.copy_ticks(symbol, 1)
                if ticks and len(ticks) > 0:
                    tick = ticks[0]
                    message = {
                        "type": "tick",
                        "symbol": symbol,
                        "bid": tick.get("bid"),
                        "ask": tick.get("ask"),
                        "time": tick.get("time")
                    }
                    await manager.broadcast_to_symbol(symbol, message)
