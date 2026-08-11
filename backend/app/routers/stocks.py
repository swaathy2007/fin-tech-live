from fastapi import APIRouter, Query
from typing import List, Dict, Any
from app.schemas.schemas import StockQuote, StockHistory
from app.services.yfinance_service import get_stock_quote, get_stock_history, search_symbols

router = APIRouter(prefix="/stocks", tags=["Stocks"])

@router.get("/quote/{symbol}", response_model=StockQuote)
async def fetch_quote(symbol: str):
    quote_data = get_stock_quote(symbol)
    return StockQuote(**quote_data)

@router.get("/history/{symbol}", response_model=StockHistory)
async def fetch_history(
    symbol: str,
    period: str = Query("1mo", description="1d, 5d, 1mo, 3mo, 6mo, 1y, 5y, max"),
    interval: str = Query("1d", description="1m, 5m, 15m, 1h, 1d, 1wk, 1mo")
):
    history_points = get_stock_history(symbol, period=period, interval=interval)
    return StockHistory(symbol=symbol.upper(), period=period, data=history_points)

@router.get("/search")
async def search_ticker(q: str = Query(..., min_length=1)):
    return search_symbols(q)
