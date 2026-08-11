from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from datetime import datetime

from app.db.session import get_db
from app.db.models import User, ChatMessage, PortfolioHolding
from app.schemas.schemas import ChatRequest, ChatMessageOut
from app.routers.auth import get_current_user
from app.services.claude_service import generate_claude_response
from app.services.yfinance_service import get_stock_quote

router = APIRouter(prefix="/chat", tags=["AI Copilot Chat"])

@router.get("/history", response_model=List[ChatMessageOut])
async def get_chat_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(ChatMessage).where(ChatMessage.user_id == current_user.id).order_by(ChatMessage.timestamp.asc())
    )
    messages = result.scalars().all()
    
    out = []
    for m in messages:
        ts_str = m.timestamp.strftime("%I:%M %p") if m.timestamp else "Just now"
        out.append(ChatMessageOut(
            id=m.id,
            role=m.role,
            mode=m.mode,
            content=m.content,
            timestamp=ts_str
        ))
    return out

@router.post("/send", response_model=ChatMessageOut)
async def send_chat_message(
    chat_in: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Save user message
    user_msg = ChatMessage(
        user_id=current_user.id,
        role="user",
        mode=chat_in.mode or "chat",
        content=chat_in.message
    )
    db.add(user_msg)
    await db.commit()
    await db.refresh(user_msg)

    # Fetch user portfolio context if needed
    portfolio_ctx = None
    if chat_in.mode == "analysis" or "portfolio" in chat_in.message.lower():
        result = await db.execute(select(PortfolioHolding).where(PortfolioHolding.user_id == current_user.id))
        holdings = result.scalars().all()
        
        holdings_list = []
        tot_val = current_user.available_balance
        for h in holdings:
            q = get_stock_quote(h.symbol)
            cp = q.get("price", h.buy_price)
            curr_v = h.quantity * cp
            tot_val += curr_v
            holdings_list.append({
                "symbol": h.symbol,
                "quantity": h.quantity,
                "buy_price": h.buy_price,
                "current_price": cp,
                "current_value": curr_v
            })

        portfolio_ctx = {
            "available_balance": current_user.available_balance,
            "total_portfolio_value": tot_val,
            "holdings": holdings_list
        }

    # Generate response from Claude API or Fallback engine
    ai_text = await generate_claude_response(
        message=chat_in.message,
        mode=chat_in.mode or "chat",
        portfolio_context=portfolio_ctx,
        user_name=current_user.name
    )

    # Save AI message
    ai_msg = ChatMessage(
        user_id=current_user.id,
        role="ai",
        mode=chat_in.mode or "chat",
        content=ai_text
    )
    db.add(ai_msg)
    await db.commit()
    await db.refresh(ai_msg)

    ts_str = ai_msg.timestamp.strftime("%I:%M %p") if ai_msg.timestamp else "Just now"
    return ChatMessageOut(
        id=ai_msg.id,
        role=ai_msg.role,
        mode=ai_msg.mode,
        content=ai_msg.content,
        timestamp=ts_str
    )

@router.post("/clear")
async def clear_chat_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(ChatMessage).where(ChatMessage.user_id == current_user.id))
    msgs = result.scalars().all()
    for m in msgs:
        await db.delete(m)
    await db.commit()
    return {"message": "Chat history cleared."}
