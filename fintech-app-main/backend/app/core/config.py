from typing import List, Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "FinSight AI Trading API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Security JWT
    SECRET_KEY: str = "finsight_super_secret_jwt_key_2026_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database (PostgreSQL with asyncpg, fallback to SQLite for local dev)
    DATABASE_URL: str = "sqlite+aiosqlite:///./finsight.db"
    
    # Redis for WebSocket Pub/Sub
    REDIS_URL: Optional[str] = None
    
    # Anthropic Claude API Key
    ANTHROPIC_API_KEY: Optional[str] = None
    
    # Allowed CORS Origins
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
