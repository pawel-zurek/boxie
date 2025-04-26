from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str = "your_secret_key_here"  # (later move to env vars)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30  # token expiration time

settings = Settings()
