from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.db.session import get_db
from app.db.models import User, PortfolioHolding
from app.schemas.schemas import PortfolioSummary, PortfolioStats, HoldingCreate, HoldingOut
from app.routers.auth import get_current_user
from app.services.yfinance_service import get_stock_quote

router = APIRouter(prefix="/portfolio", tags=["Portfolio"])

@router.get("/summary", response_model=PortfolioSummary)
async def get_portfolio_summary(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(PortfolioHolding).where(PortfolioHolding.user_id == current_user.id))
    holdings_raw = result.scalars().all()

    holdings_out: List[HoldingOut] = []
    total_holdings_value = 0.0
    total_invested = 0.0

    for h in holdings_raw:
        quote = get_stock_quote(h.symbol)
        current_price = quote.get("price", h.buy_price)
        
        invested_val = h.quantity * h.buy_price
        current_val = h.quantity * current_price
        profit_loss = current_val - invested_val
        return_pct = (profit_loss / invested_val * 100) if invested_val > 0 else 0.0

        total_holdings_value += current_val
        total_invested += invested_val

        holdings_out.append(HoldingOut(
            id=h.id,
            user_id=h.user_id,
            asset_id=h.asset_id,
            asset_name=h.asset_name,
            symbol=h.symbol,
            quantity=h.quantity,
            buy_price=h.buy_price,
            buy_date=h.buy_date,
            category=h.category,
            current_price=current_price,
            current_value=round(current_val, 2),
            profit_loss=round(profit_loss, 2),
            return_percent=round(return_pct, 2)
        ))

    total_portfolio_value = current_user.available_balance + total_holdings_value
    total_profit_loss = total_holdings_value - total_invested
    total_return_pct = (total_profit_loss / total_invested * 100) if total_invested > 0 else 0.0

    stats = PortfolioStats(
        available_balance=round(current_user.available_balance, 2),
        total_holdings_value=round(total_holdings_value, 2),
        total_portfolio_value=round(total_portfolio_value, 2),
        total_invested=round(total_invested, 2),
        total_profit_loss=round(total_profit_loss, 2),
        total_return_percent=round(total_return_pct, 2)
    )

    return PortfolioSummary(stats=stats, holdings=holdings_out)

@router.post("/buy", response_model=HoldingOut, status_code=status.HTTP_201_CREATED)
async def buy_asset(
    holding_in: HoldingCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    total_cost = holding_in.quantity * holding_in.buy_price
    if total_cost > current_user.available_balance:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient available balance! Required: ₹{total_cost:,.2f}, Available: ₹{current_user.available_balance:,.2f}"
        )

    # Deduct balance
    current_user.available_balance -= total_cost

    new_holding = PortfolioHolding(
        user_id=current_user.id,
        asset_id=holding_in.asset_id,
        asset_name=holding_in.asset_name,
        symbol=holding_in.symbol.upper(),
        quantity=holding_in.quantity,
        buy_price=holding_in.buy_price,
        buy_date=holding_in.buy_date or None,
        category=holding_in.category or "stock"
    )

    db.add(new_holding)
    await db.commit()
    await db.refresh(new_holding)

    quote = get_stock_quote(new_holding.symbol)
    curr_price = quote.get("price", new_holding.buy_price)
    curr_val = new_holding.quantity * curr_price
    invested_val = new_holding.quantity * new_holding.buy_price
    pnl = curr_val - invested_val
    ret_pct = (pnl / invested_val * 100) if invested_val > 0 else 0.0

    return HoldingOut(
        id=new_holding.id,
        user_id=new_holding.user_id,
        asset_id=new_holding.asset_id,
        asset_name=new_holding.asset_name,
        symbol=new_holding.symbol,
        quantity=new_holding.quantity,
        buy_price=new_holding.buy_price,
        buy_date=new_holding.buy_date,
        category=new_holding.category,
        current_price=curr_price,
        current_value=round(curr_val, 2),
        profit_loss=round(pnl, 2),
        return_percent=round(ret_pct, 2)
    )

@router.post("/sell/{holding_id}")
async def sell_asset(
    holding_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(PortfolioHolding).where(
            PortfolioHolding.id == holding_id,
            PortfolioHolding.user_id == current_user.id
        )
    )
    holding = result.scalars().first()
    if not holding:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Holding not found")

    quote = get_stock_quote(holding.symbol)
    current_price = quote.get("price", holding.buy_price)
    sale_proceeds = holding.quantity * current_price

    current_user.available_balance += sale_proceeds
    await db.delete(holding)
    await db.commit()

    return {"message": f"Successfully sold {holding.symbol} for ₹{sale_proceeds:,.2f}", "new_balance": current_user.available_balance}

@router.post("/reset")
async def reset_portfolio(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Remove all holdings
    result = await db.execute(select(PortfolioHolding).where(PortfolioHolding.user_id == current_user.id))
    holdings = result.scalars().all()
    for h in holdings:
        await db.delete(h)

    current_user.available_balance = 1000000.0
    await db.commit()

    return {"message": "Portfolio reset to default state.", "available_balance": 1000000.0}
