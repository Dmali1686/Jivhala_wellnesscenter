from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
from uuid import UUID

class ProgressLogBase(BaseModel):
    weight: float
    date: Optional[date] = None

class ProgressLogCreate(ProgressLogBase):
    pass

class ProgressLogResponse(ProgressLogBase):
    id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
