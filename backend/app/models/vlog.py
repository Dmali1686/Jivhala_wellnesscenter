from sqlalchemy import Column, String, DateTime, text
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.models.base import Base

class Vlog(Base):
    __tablename__ = "vlogs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    youtube_url = Column(String, nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=text('now()'), nullable=False)
