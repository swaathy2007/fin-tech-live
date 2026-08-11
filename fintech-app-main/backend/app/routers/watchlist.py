from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.db.session import get_db
from app.db.models import User, Watchlist
from app.schemas.schemas import WatchlistCreate, WatchlistOut
from app.routers.auth import get_current_user

router = APIRouter(prefix="/watchlist", tags=["Watchlist"])

@router.get("", response_model=List[WatchlistOut])
async def get_watchlist(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Watchlist).where(Watchlist.user_id == current_user.id))
    return result.scalars().all()

@router.post("", response_model=WatchlistOut, status_code=status.HTTP_201_CREATED)
async def add_to_watchlist(
    item_in: WatchlistCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Watchlist).where(
            Watchlist.user_id == current_user.id,
            Watchlist.symbol == item_in.symbol.upper()
        )
    )
    if result.scalars().first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Symbol already in watchlist")

    new_item = Watchlist(
        user_id=current_user.id,
        symbol=item_in.symbol.upper(),
        asset_name=item_in.asset_name
    )
    db.add(new_item)
    await db.commit()
    await db.refresh(new_item)
    return new_item

@router.delete("/{symbol}")
async def remove_from_watchlist(
    symbol: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Watchlist).where(
            Watchlist.user_id == current_user.id,
            Watchlist.symbol == symbol.upper()
        )
    )
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Watchlist item not found")

    await db.delete(item)
    await db.commit()
    return {"message": f"Removed {symbol} from watchlist"}
