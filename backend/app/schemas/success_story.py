from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from uuid import UUID

class SuccessStoryBase(BaseModel):
    name_en: str
    name_mr: str
    loss_en: str
    loss_mr: str
    feedback_en: str
    feedback_mr: str
    
    before_image: str
    after_image: str
    before_weight: Optional[str] = None
    after_weight: Optional[str] = None

class SuccessStoryCreate(SuccessStoryBase):
    pass

class SuccessStoryResponse(SuccessStoryBase):
    id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
