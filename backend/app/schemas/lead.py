from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from uuid import UUID
from datetime import datetime
from app.models.lead import CallStatus

class LeadCreate(BaseModel):
    name: str = Field(..., example="John Doe")
    email: Optional[EmailStr] = Field(None, example="john@example.com")
    mobile_number: str = Field(..., example="+1234567890")
    consent_given: bool = Field(True, description="Must be true to submit")
    language: Optional[str] = Field('en', example="mr", description="User's language preference: 'mr' or 'en'")
    
class LeadResponse(BaseModel):
    id: UUID
    name: str
    email: Optional[str]
    mobile_number: str
    consent_given: bool
    call_status: CallStatus
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
