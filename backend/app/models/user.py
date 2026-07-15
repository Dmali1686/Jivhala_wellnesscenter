import uuid
from sqlalchemy import Column, String, DateTime, Float, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.models.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    username = Column(String, unique=True, index=True, nullable=True) # Optional for clients
    mobile_number = Column(String, unique=True, index=True, nullable=True) # Used by clients for login
    password_hash = Column(String, nullable=False)
    role = Column(String, default="client") # "admin" or "client"
    
    # Client Dashboard Metrics
    height = Column(Float, nullable=True) # e.g. cm
    target_weight = Column(Float, nullable=True) # e.g. kg
    streak = Column(Integer, default=0) # Days logged continuously
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
