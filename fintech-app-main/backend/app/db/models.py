import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.session import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    currency = Column(String, default="INR")
    theme = Column(String, default="dark")
    available_balance = Column(Float, default=1000000.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    holdings = relationship("PortfolioHolding", back_populates="user", cascade="all, delete-orphan")
    watchlist = relationship("Watchlist", back_populates="user", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="user", cascade="all, delete-orphan")
    chat_messages = relationship("ChatMessage", back_populates="user", cascade="all, delete-orphan")

class PortfolioHolding(Base):
    __tablename__ = "portfolio_holdings"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    asset_id = Column(String, nullable=False)
    asset_name = Column(String, nullable=False)
    symbol = Column(String, nullable=False, index=True)
    quantity = Column(Float, nullable=False)
    buy_price = Column(Float, nullable=False)
    buy_date = Column(String, default=lambda: datetime.utcnow().strftime("%Y-%m-%d"))
    category = Column(String, default="stock")

    user = relationship("User", back_populates="holdings")

class Watchlist(Base):
    __tablename__ = "watchlists"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    symbol = Column(String, nullable=False)
    asset_name = Column(String, nullable=False)
    added_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="watchlist")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    symbol = Column(String, nullable=False)
    target_price = Column(Float, nullable=False)
    condition = Column(String, default="above")  # 'above' or 'below'
    is_triggered = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="alerts")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    role = Column(String, nullable=False)  # 'user' or 'ai'
    mode = Column(String, default="chat")  # 'chat', 'learning', 'analysis'
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="chat_messages")
