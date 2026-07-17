from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Jivhala Wellness Center API"
    API_V1_STR: str = "/api/v1"
    
    # Environment: "development" or "production"
    ENVIRONMENT: str = "development"
    
    # Secret key for JWT — MUST be overridden via .env in production
    SECRET_KEY: str = "supersecretkey-please-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours (reduced from 7 days)
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5433/jivhala_wellness"
    
    # CORS — restrict to your frontend domain(s) in production
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    # WhatsApp bot inter-service API key
    WHATSAPP_BOT_API_KEY: str = "change-this-whatsapp-api-key-in-production"
    
    model_config = SettingsConfigDict(env_file=".env", env_ignore_empty=True)

settings = Settings()

