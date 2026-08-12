from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.redis_ws_service import manager

router = APIRouter(tags=["WebSocket"])

@router.websocket("/ws/prices")
async def websocket_price_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive & listen for optional client ping messages
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)
