from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class UserBase(BaseModel):
    username: Optional[str] = None
    mobile_number: Optional[str] = None
    role: str = "client"
    height: Optional[float] = None
    target_weight: Optional[float] = None
    streak: int = 0

class UserCreate(UserBase):
    password: str
    mobile_number: str # Mobile is required for client creation

class UserResponse(UserBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str

class TokenData(BaseModel):
    mobile_number: Optional[str] = None
