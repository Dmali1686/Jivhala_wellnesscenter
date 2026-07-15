import uuid
import enum
from sqlalchemy import Column, String, Boolean, Enum, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.models.base import Base

class CallStatus(str, enum.Enum):
    new = "new"
    interested = "interested"
    follow_up = "follow_up"
    joined = "joined"
    not_interested = "not_interested"

class Lead(Base):
    __tablename__ = "leads"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=True)
    mobile_number = Column(String, unique=True, index=True, nullable=False)
    consent_given = Column(Boolean, nullable=False, default=False)
    call_status = Column(Enum(CallStatus), default=CallStatus.new, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
