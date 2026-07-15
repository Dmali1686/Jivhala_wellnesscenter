from pydantic import BaseModel, ConfigDict
from datetime import datetime
from uuid import UUID

class VlogBase(BaseModel):
    title: str
    category: str
    youtube_url: str

class VlogCreate(VlogBase):
    pass

class VlogResponse(VlogBase):
    id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
