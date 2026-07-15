import uuid
from sqlalchemy import Column, String, Boolean, Text, Integer, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.models.base import Base

class Transformation(Base):
    __tablename__ = "transformations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String, nullable=False)
    goal = Column(String, nullable=False)
    gender = Column(String, nullable=False)
    before_image_url = Column(String, nullable=False)
    after_image_url = Column(String, nullable=False)
    story = Column(Text, nullable=False)
    consent_given = Column(Boolean, nullable=False, default=False)
    is_published = Column(Boolean, nullable=False, default=False)
    views = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Testimonial(Base):
    __tablename__ = "testimonials"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String, nullable=False)
    rating = Column(Integer, nullable=False)
    text = Column(Text, nullable=False)
    photo_url = Column(String, nullable=True)
    video_url = Column(String, nullable=True)
    consent_given = Column(Boolean, nullable=False, default=False)
    is_published = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
