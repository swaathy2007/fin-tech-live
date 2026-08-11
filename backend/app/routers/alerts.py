from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.db.session import get_db
from app.db.models import User, Alert
from app.schemas.schemas import AlertCreate, AlertOut
from app.routers.auth import get_current_user

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.get("", response_model=List[AlertOut])
async def get_alerts(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Alert).where(Alert.user_id == current_user.id))
    return result.scalars().all()

@router.post("", response_model=AlertOut, status_code=status.HTTP_201_CREATED)
async def create_alert(
    alert_in: AlertCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    new_alert = Alert(
        user_id=current_user.id,
        symbol=alert_in.symbol.upper(),
        target_price=alert_in.target_price,
        condition=alert_in.condition
    )
    db.add(new_alert)
    await db.commit()
    await db.refresh(new_alert)
    return new_alert

@router.delete("/{alert_id}")
async def delete_alert(
    alert_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Alert).where(
            Alert.id == alert_id,
            Alert.user_id == current_user.id
        )
    )
    alert = result.scalars().first()
    if not alert:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Alert not found")

    await db.delete(alert)
    await db.commit()
    return {"message": "Alert deleted"}
