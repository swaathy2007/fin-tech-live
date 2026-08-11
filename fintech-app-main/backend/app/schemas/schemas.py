from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr

# Auth Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    email: str
    name: str
    currency: str
    theme: str
    available_balance: float

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

# Stock Schemas
class StockQuote(BaseModel):
    symbol: str
    name: str
    price: float
    change: float
    change_percent: float
    high: float
    low: float
    volume: int
    market_cap: str
    category: str

class StockHistoryPoint(BaseModel):
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: int

class StockHistory(BaseModel):
    symbol: str
    period: str
    data: List[StockHistoryPoint]

# Portfolio Schemas
class HoldingCreate(BaseModel):
    asset_id: str
    asset_name: str
    symbol: str
    quantity: float
    buy_price: float
    buy_date: Optional[str] = None
    category: Optional[str] = "stock"

class HoldingOut(BaseModel):
    id: str
    user_id: str
    asset_id: str
    asset_name: str
    symbol: str
    quantity: float
    buy_price: float
    buy_date: str
    category: str
    current_price: float
    current_value: float
    profit_loss: float
    return_percent: float

    class Config:
        from_attributes = True

class PortfolioStats(BaseModel):
    available_balance: float
    total_holdings_value: float
    total_portfolio_value: float
    total_invested: float
    total_profit_loss: float
    total_return_percent: float

class PortfolioSummary(BaseModel):
    stats: PortfolioStats
    holdings: List[HoldingOut]

# Watchlist Schemas
class WatchlistCreate(BaseModel):
    symbol: str
    asset_name: str

class WatchlistOut(BaseModel):
    id: str
    symbol: str
    asset_name: str
    added_at: datetime

    class Config:
        from_attributes = True

# Alert Schemas
class AlertCreate(BaseModel):
    symbol: str
    target_price: float
    condition: str = "above"  # 'above' or 'below'

class AlertOut(BaseModel):
    id: str
    symbol: str
    target_price: float
    condition: str
    is_triggered: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Chat Schemas
class ChatRequest(BaseModel):
    message: str
    mode: Optional[str] = "chat"  # 'chat', 'learning', 'analysis'

class ChatMessageOut(BaseModel):
    id: str
    role: str
    mode: str
    content: str
    timestamp: str

    class Config:
        from_attributes = True
