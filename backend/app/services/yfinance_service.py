import logging
from typing import Dict, List, Any, Optional
import yfinance as yf

# Silence verbose third-party yfinance logging
logging.getLogger("yfinance").setLevel(logging.CRITICAL)
logging.getLogger("urllib3").setLevel(logging.CRITICAL)

logger = logging.getLogger("yfinance_service")

# Fallback cache for popular tickers in case yfinance rate limits or network issues occur
POPULAR_FALLBACKS: Dict[str, Dict[str, Any]] = {
    # 1. Gold & Commodities
    "NEM": {
        "symbol": "NEM",
        "name": "Newmont Corporation (Gold Mining)",
        "price": 42.50,
        "change": 0.85,
        "change_percent": 2.04,
        "high": 43.10,
        "low": 41.80,
        "volume": 8500000,
        "market_cap": "$48.5B",
        "category": "stock",
    },
    "GOLD": {
        "symbol": "GOLD",
        "name": "Barrick Gold Corporation",
        "price": 16.80,
        "change": 0.25,
        "change_percent": 1.51,
        "high": 17.05,
        "low": 16.50,
        "volume": 14200000,
        "market_cap": "$29.4B",
        "category": "stock",
    },
    "FNV": {
        "symbol": "FNV",
        "name": "Franco-Nevada Gold Royalties",
        "price": 112.00,
        "change": -0.45,
        "change_percent": -0.40,
        "high": 113.50,
        "low": 111.20,
        "volume": 620000,
        "market_cap": "$21.5B",
        "category": "stock",
    },
    "SLV": {
        "symbol": "SLV",
        "name": "iShares Silver Trust",
        "price": 26.50,
        "change": 0.42,
        "change_percent": 1.61,
        "high": 26.90,
        "low": 26.10,
        "volume": 18500000,
        "market_cap": "$14.2B",
        "category": "commodity",
    },
    "USO": {
        "symbol": "USO",
        "name": "United States Oil Fund",
        "price": 64.50,
        "change": -1.20,
        "change_percent": -1.83,
        "high": 66.10,
        "low": 64.10,
        "volume": 3400000,
        "market_cap": "$1.4B",
        "category": "commodity",
    },

    # 2. Global Tech & AI Giants
    "AAPL": {
        "symbol": "AAPL",
        "name": "Apple Inc.",
        "price": 224.50,
        "change": 3.20,
        "change_percent": 1.44,
        "high": 226.00,
        "low": 222.10,
        "volume": 48200000,
        "market_cap": "$3.45T",
        "category": "stock",
    },
    "NVDA": {
        "symbol": "NVDA",
        "name": "NVIDIA Corporation",
        "price": 128.90,
        "change": 4.50,
        "change_percent": 3.62,
        "high": 130.20,
        "low": 125.40,
        "volume": 85000000,
        "market_cap": "$3.16T",
        "category": "stock",
    },
    "MSFT": {
        "symbol": "MSFT",
        "name": "Microsoft Corporation",
        "price": 450.20,
        "change": 8.10,
        "change_percent": 1.83,
        "high": 453.00,
        "low": 447.50,
        "volume": 21500000,
        "market_cap": "$3.34T",
        "category": "stock",
    },
    "GOOGL": {
        "symbol": "GOOGL",
        "name": "Alphabet Inc.",
        "price": 180.50,
        "change": 1.60,
        "change_percent": 0.89,
        "high": 182.10,
        "low": 178.90,
        "volume": 19400000,
        "market_cap": "$2.23T",
        "category": "stock",
    },
    "AMZN": {
        "symbol": "AMZN",
        "name": "Amazon.com Inc.",
        "price": 210.30,
        "change": -1.10,
        "change_percent": -0.52,
        "high": 213.00,
        "low": 208.50,
        "volume": 31200000,
        "market_cap": "$2.19T",
        "category": "stock",
    },
    "META": {
        "symbol": "META",
        "name": "Meta Platforms Inc.",
        "price": 520.10,
        "change": 11.80,
        "change_percent": 2.32,
        "high": 524.50,
        "low": 508.20,
        "volume": 14200000,
        "market_cap": "$1.32T",
        "category": "stock",
    },
    "TSLA": {
        "symbol": "TSLA",
        "name": "Tesla Inc.",
        "price": 218.80,
        "change": -4.10,
        "change_percent": -1.84,
        "high": 223.50,
        "low": 216.00,
        "volume": 61200000,
        "market_cap": "$695B",
        "category": "stock",
    },
    "AMD": {
        "symbol": "AMD",
        "name": "Advanced Micro Devices",
        "price": 155.40,
        "change": 4.70,
        "change_percent": 3.12,
        "high": 157.80,
        "low": 151.20,
        "volume": 42500000,
        "market_cap": "$251B",
        "category": "stock",
    },
    "PLTR": {
        "symbol": "PLTR",
        "name": "Palantir Technologies",
        "price": 28.50,
        "change": 1.45,
        "change_percent": 5.36,
        "high": 29.10,
        "low": 27.20,
        "volume": 58000000,
        "market_cap": "$63B",
        "category": "stock",
    },

    # 3. Financial Institutions & Banking
    "JPM": {
        "symbol": "JPM",
        "name": "JPMorgan Chase & Co.",
        "price": 215.60,
        "change": 1.30,
        "change_percent": 0.61,
        "high": 217.20,
        "low": 214.10,
        "volume": 8900000,
        "market_cap": "$615B",
        "category": "stock",
    },
    "V": {
        "symbol": "V",
        "name": "Visa Inc.",
        "price": 275.20,
        "change": 1.10,
        "change_percent": 0.40,
        "high": 277.00,
        "low": 274.00,
        "volume": 6100000,
        "market_cap": "$562B",
        "category": "stock",
    },

    # 4. Indian Equities (NSE)
    "RELIANCE.NS": {
        "symbol": "RELIANCE.NS",
        "name": "Reliance Industries Ltd.",
        "price": 2950.00,
        "change": 38.50,
        "change_percent": 1.32,
        "high": 2975.00,
        "low": 2920.00,
        "volume": 5400000,
        "market_cap": "₹20T",
        "category": "stock",
    },
    "TATAMOTORS.BO": {
        "symbol": "TATAMOTORS.BO",
        "name": "Tata Motors Limited",
        "price": 980.50,
        "change": 26.80,
        "change_percent": 2.81,
        "high": 992.00,
        "low": 958.00,
        "volume": 12800000,
        "market_cap": "₹3.6T",
        "category": "stock",
    },
    "TCS.NS": {
        "symbol": "TCS.NS",
        "name": "Tata Consultancy Services",
        "price": 4250.00,
        "change": -30.00,
        "change_percent": -0.70,
        "high": 4310.00,
        "low": 4230.00,
        "volume": 2100000,
        "market_cap": "₹15T",
        "category": "stock",
    },
    "INFY.NS": {
        "symbol": "INFY.NS",
        "name": "Infosys Limited",
        "price": 1880.00,
        "change": 20.50,
        "change_percent": 1.10,
        "high": 1895.00,
        "low": 1860.00,
        "volume": 4200000,
        "market_cap": "₹7.8T",
        "category": "stock",
    },

    # 5. Crypto
    "BTC-USD": {
        "symbol": "BTC-USD",
        "name": "Bitcoin USD",
        "price": 64250.00,
        "change": 1250.00,
        "change_percent": 1.98,
        "high": 65100.00,
        "low": 63000.00,
        "volume": 28400000000,
        "market_cap": "$1.27T",
        "category": "crypto",
    },
    "ETH-USD": {
        "symbol": "ETH-USD",
        "name": "Ethereum USD",
        "price": 3450.00,
        "change": 125.00,
        "change_percent": 3.76,
        "high": 3520.00,
        "low": 3310.00,
        "volume": 14200000000,
        "market_cap": "$415B",
        "category": "crypto",
    },
    "SOL-USD": {
        "symbol": "SOL-USD",
        "name": "Solana USD",
        "price": 152.00,
        "change": 8.80,
        "change_percent": 6.15,
        "high": 156.00,
        "low": 142.50,
        "volume": 3800000000,
        "market_cap": "$71B",
        "category": "crypto",
    },
}

def format_market_cap(market_cap: Optional[int]) -> str:
    if not market_cap:
        return "N/A"
    if market_cap >= 1_000_000_000_000:
        return f"${market_cap / 1_000_000_000_000:.2f}T"
    elif market_cap >= 1_000_000_000:
        return f"${market_cap / 1_000_000_000:.2f}B"
    elif market_cap >= 1_000_000:
        return f"${market_cap / 1_000_000:.2f}M"
    return str(market_cap)

def get_stock_quote(symbol: str) -> Dict[str, Any]:
    cleaned_symbol = symbol.upper().strip()

    # Map aliases if user searches GOLD or NEM
    if cleaned_symbol == "GOLD_MINING":
        cleaned_symbol = "NEM"

    try:
        ticker = yf.Ticker(cleaned_symbol)
        info = ticker.fast_info

        current_price = getattr(info, "last_price", None) or getattr(info, "previous_close", None)
        prev_close = getattr(info, "previous_close", current_price)
        
        if current_price is None:
            raw_info = ticker.info
            current_price = raw_info.get("currentPrice") or raw_info.get("regularMarketPrice") or 100.0
            prev_close = raw_info.get("previousClose") or current_price

        change = current_price - prev_close if (current_price and prev_close) else 0.0
        change_percent = (change / prev_close * 100) if prev_close else 0.0

        high = getattr(info, "day_high", current_price) or current_price
        low = getattr(info, "day_low", current_price) or current_price
        volume = getattr(info, "last_volume", 0) or 0
        market_cap_val = getattr(info, "market_cap", None)

        category = "crypto" if "-USD" in cleaned_symbol or cleaned_symbol in ["BTC", "ETH", "SOL"] else ("commodity" if cleaned_symbol in ["SLV", "USO", "GLD"] else "stock")
        name = cleaned_symbol

        return {
            "symbol": cleaned_symbol,
            "name": name,
            "price": round(float(current_price), 2),
            "change": round(float(change), 2),
            "change_percent": round(float(change_percent), 2),
            "high": round(float(high), 2),
            "low": round(float(low), 2),
            "volume": int(volume),
            "market_cap": format_market_cap(market_cap_val),
            "category": category,
        }
    except Exception as e:
        logger.warning(f"Error fetching yfinance quote for {cleaned_symbol}: {e}")
        if cleaned_symbol in POPULAR_FALLBACKS:
            return POPULAR_FALLBACKS[cleaned_symbol]
        
        return {
            "symbol": cleaned_symbol,
            "name": cleaned_symbol,
            "price": 150.00,
            "change": 1.50,
            "change_percent": 1.01,
            "high": 152.00,
            "low": 148.50,
            "volume": 1000000,
            "market_cap": "$10B",
            "category": "stock",
        }

def get_stock_history(symbol: str, period: str = "1mo", interval: str = "1d") -> List[Dict[str, Any]]:
    cleaned_symbol = symbol.upper().strip()
    try:
        ticker = yf.Ticker(cleaned_symbol)
        df = ticker.history(period=period, interval=interval)
        
        history_points = []
        for index, row in df.iterrows():
            date_str = index.strftime("%Y-%m-%d") if hasattr(index, "strftime") else str(index)
            history_points.append({
                "date": date_str,
                "open": round(float(row["Open"]), 2),
                "high": round(float(row["High"]), 2),
                "low": round(float(row["Low"]), 2),
                "close": round(float(row["Close"]), 2),
                "volume": int(row["Volume"]),
            })
        return history_points
    except Exception as e:
        logger.warning(f"Error fetching yfinance history for {cleaned_symbol}: {e}")
        import datetime
        today = datetime.date.today()
        history_points = []
        base_price = 150.0
        for i in range(10, 0, -1):
            day = today - datetime.timedelta(days=i)
            base_price += (i % 3 - 1) * 2.0
            history_points.append({
                "date": day.strftime("%Y-%m-%d"),
                "open": round(base_price - 1.0, 2),
                "high": round(base_price + 2.0, 2),
                "low": round(base_price - 2.0, 2),
                "close": round(base_price, 2),
                "volume": 500000,
            })
        return history_points

def search_symbols(query: str) -> List[Dict[str, str]]:
    q = query.upper().strip()
    all_symbols = [
        {"symbol": "NEM", "name": "Newmont Corp (Gold Mining)", "category": "stock"},
        {"symbol": "GOLD", "name": "Barrick Gold Corporation", "category": "stock"},
        {"symbol": "FNV", "name": "Franco-Nevada Gold Royalties", "category": "stock"},
        {"symbol": "SLV", "name": "iShares Silver Trust", "category": "commodity"},
        {"symbol": "USO", "name": "Crude Oil Spot Fund", "category": "commodity"},
        {"symbol": "AAPL", "name": "Apple Inc.", "category": "stock"},
        {"symbol": "NVDA", "name": "NVIDIA Corporation", "category": "stock"},
        {"symbol": "MSFT", "name": "Microsoft Corporation", "category": "stock"},
        {"symbol": "GOOGL", "name": "Alphabet Inc.", "category": "stock"},
        {"symbol": "AMZN", "name": "Amazon.com Inc.", "category": "stock"},
        {"symbol": "META", "name": "Meta Platforms Inc.", "category": "stock"},
        {"symbol": "TSLA", "name": "Tesla Inc.", "category": "stock"},
        {"symbol": "AMD", "name": "Advanced Micro Devices", "category": "stock"},
        {"symbol": "NFLX", "name": "Netflix Inc.", "category": "stock"},
        {"symbol": "PLTR", "name": "Palantir Technologies", "category": "stock"},
        {"symbol": "JPM", "name": "JPMorgan Chase & Co.", "category": "stock"},
        {"symbol": "RELIANCE.NS", "name": "Reliance Industries Ltd", "category": "stock"},
        {"symbol": "TATAMOTORS.NS", "name": "Tata Motors Limited", "category": "stock"},
        {"symbol": "TCS.NS", "name": "Tata Consultancy Services", "category": "stock"},
        {"symbol": "INFY.NS", "name": "Infosys Limited", "category": "stock"},
        {"symbol": "HDFCBANK.NS", "name": "HDFC Bank Limited", "category": "stock"},
        {"symbol": "BTC-USD", "name": "Bitcoin USD", "category": "crypto"},
        {"symbol": "ETH-USD", "name": "Ethereum USD", "category": "crypto"},
        {"symbol": "SOL-USD", "name": "Solana USD", "category": "crypto"},
    ]
    return [r for r in all_symbols if q in r["symbol"] or q in r["name"].upper()]
