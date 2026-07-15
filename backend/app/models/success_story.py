from sqlalchemy import Column, String, DateTime, text
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.models.base import Base

class SuccessStory(Base):
    __tablename__ = "success_stories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name_en = Column(String, nullable=False)
    name_mr = Column(String, nullable=False)
    loss_en = Column(String, nullable=False)
    loss_mr = Column(String, nullable=False)
    feedback_en = Column(String, nullable=False)
    feedback_mr = Column(String, nullable=False)
    
    before_image = Column(String, nullable=False)
    after_image = Column(String, nullable=False)
    before_weight = Column(String, nullable=True)
    after_weight = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=text('now()'), nullable=False)
