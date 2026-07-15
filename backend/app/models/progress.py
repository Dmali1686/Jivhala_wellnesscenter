import uuid
from sqlalchemy import Column, Float, DateTime, ForeignKey, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.models.base import Base

class ProgressLog(Base):
    __tablename__ = "progress_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    date = Column(Date, nullable=False, default=func.current_date(), index=True)
    weight = Column(Float, nullable=False) # e.g. kg
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
