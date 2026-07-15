from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Jivhala Wellness Center API"
    API_V1_STR: str = "/api/v1"
    
    # Secret key for JWT
    SECRET_KEY: str = "supersecretkey-please-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5433/jivhala_wellness"
    
    model_config = SettingsConfigDict(env_file=".env", env_ignore_empty=True)

settings = Settings()
