import asyncio
import json
import logging
from typing import List, Dict, Any, Optional
from fastapi import WebSocket, WebSocketDisconnect
from app.core.config import settings
from app.services.yfinance_service import get_stock_quote

logger = logging.getLogger("redis_ws_service")

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"WebSocket client connected. Total clients: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            logger.info(f"WebSocket client disconnected. Remaining clients: {len(self.active_connections)}")

    async def broadcast_json(self, data: Dict[str, Any]):
        message_str = json.dumps(data)
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_text(message_str)
            except Exception as e:
                logger.warning(f"Error sending WebSocket message: {e}")
                disconnected.append(connection)
        
        for conn in disconnected:
            self.disconnect(conn)

manager = ConnectionManager()

# Optional Redis Pub/Sub integration
redis_client = None

async def get_redis():
    global redis_client
    if settings.REDIS_URL and redis_client is None:
        try:
            import redis.asyncio as aioredis
            redis_client = aioredis.from_url(settings.REDIS_URL, encoding="utf-8", decode_responses=True)
            logger.info("Successfully connected to Redis instance.")
        except Exception as e:
            logger.warning(f"Could not connect to Redis at {settings.REDIS_URL}: {e}")
            redis_client = None
    return redis_client

async def broadcast_price_update(symbols: List[str]):
    """Fetches quotes for symbols and broadcasts via WebSockets & Redis."""
    updates = []
    for sym in symbols:
        try:
            quote = get_stock_quote(sym)
            updates.append(quote)
        except Exception as e:
            logger.error(f"Error fetching quote for {sym}: {e}")

    payload = {
        "type": "price_update",
        "timestamp": asyncio.get_event_loop().time(),
        "data": updates
    }

    # Broadcast to locally connected WebSockets
    await manager.broadcast_json(payload)

    # Publish to Redis if configured
    r = await get_redis()
    if r:
        try:
            await r.publish("stock_prices", json.dumps(payload))
        except Exception as e:
            logger.warning(f"Redis publish error: {e}")

async def price_poller_task():
    """Background task polling live price updates every 4 seconds."""
    symbols = [
        "NEM", "GOLD", "SLV", "USO", "AAPL", "BTC-USD",
        "TSLA", "NVDA", "MSFT", "GOOGL", "AMZN", "META",
        "AMD", "PLTR", "JPM", "RELIANCE.NS", "TATAMOTORS.BO",
        "TCS.NS", "INFY.NS", "ETH-USD", "SOL-USD"
    ]
    logger.info(f"Starting background price poller for symbols: {symbols}")
    while True:
        try:
            await broadcast_price_update(symbols)
        except Exception as e:
            logger.error(f"Error in price poller loop: {e}")
        await asyncio.sleep(4)
