"""Application configuration"""

from pydantic_settings import BaseSettings
from typing import List, Union


class Settings(BaseSettings):
    """Application settings"""
    
    # MT5 Configuration
    MT5_LOGIN: int = 12345678
    MT5_PASSWORD: str = "YourPassword"
    MT5_SERVER: str = "MetaQuotes-Demo"
    MT5_PATH: str = ""
    MT5_TIMEOUT: int = 60000
    
    # API Configuration
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    API_RELOAD: bool = True
    
    # Database Configuration
    DATABASE_TYPE: str = "sqlite"
    DATABASE_URL: str = "sqlite:///./trading.db"
    
    # Security
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS - can be either a comma-separated string or a list
    CORS_ORIGINS: Union[str, List[str]] = "http://localhost:3000,http://localhost:5173,http://localhost:19006"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = True
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Convert CORS_ORIGINS to a list if it's a string"""
        if isinstance(self.CORS_ORIGINS, str):
            return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
        return self.CORS_ORIGINS


settings = Settings()
