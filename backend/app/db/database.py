"""Database configuration and session management"""

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)

# Create async engine
if settings.DATABASE_TYPE == "sqlite":
    database_url = settings.DATABASE_URL.replace("sqlite:///", "sqlite+aiosqlite:///")
elif settings.DATABASE_TYPE == "postgresql":
    database_url = settings.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")
else:
    database_url = settings.DATABASE_URL

engine = create_async_engine(
    database_url,
    echo=False,
    future=True
)

# Create session factory
async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Base class for models
Base = declarative_base()


async def get_db():
    """Dependency for getting database session"""
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db():
    """Initialize database tables"""
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        raise
