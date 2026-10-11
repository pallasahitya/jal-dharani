import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

# Configurable database connection using DATABASE_URL environment variable
# Default connects to the local jal-dharani-db Docker container
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://jal_user:jal_password@localhost:5432/jal_dharani",
)

# SQLAlchemy engine configured with psycopg (PostgreSQL 3.x driver)
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency yielding a database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initializes PostGIS extension and creates all database tables."""
    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
        conn.commit()
    Base.metadata.create_all(bind=engine)
